import Polyglot from 'node-polyglot';

class Polywrap {
    constructor(tPath, defLang) {
        this.tPath = tPath;
        this.defLang = defLang;

        let userLang = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;

        this.translator = new Polyglot();
        this.promise = null;
        this.fallBackReq = false;
        this.setLang(userLang);
    }

    setLang(userLang) {
      let lang;
      let promise;

      promise = new Promise(function(resolve, reject) {
        var waitForChunk = require("bundle-loader?lazy!../langs/" + userLang + ".js");
        waitForChunk((file)=> {
          resolve(file);
        });
      });

      this.promise = promise
        .then((translation) => {
            this.translator.replace(translation.default.phrases);
            this.promise = null;
            this.fallBackReq = false;
            return true;
        }).catch(()=> {
            if (this.fallBackReq) {
              this.translator.clear();
              return false;
            }

            this.fallBackReq = true;
            this.promise = this.setLang(this.defLang);
        });

      return this.promise;
    }

    translate(keyword, params, namespace='') {
        if(keyword === undefined || keyword === null)
            return keyword;

        if(namespace.length > 0)
            namespace += '.';

        if(this.promise !== null)
            return this.promise.then(()=> {
                return this.translator.t(`${namespace}${keyword}`, params);
            });
        else
            return this.translator.t(`${namespace}${keyword}`, params);
    }
}

export default Polywrap;
