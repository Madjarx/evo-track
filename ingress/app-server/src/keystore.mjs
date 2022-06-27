import fs from 'fs'

class KeyStore {

    loadKeyById(id){
        throw "Not Implemented"
    }


}

// tests to make sure with works with local file key store json 
class LocalFileKeyStore extends KeyStore{
    constructor({path}){
        self.path = path;
        self.file = JSON.parse(fs.readFileSync(path));
    }

    loadKeyById(id){
        //TODO: does stepca support giving us keys or does it ask for the whole JWT
        return self.file[id]
    }
}

export { KeyStore }
export { LocalFileKeyStore }

// export default KeyStore

// req -> headers -> authorization -> JWT -> {keyID || content} -> stepca -> awdid -> sheets id

// GET http://partners.evoeco.com:8080/api/v1/bins/{awdid}  -> sheets id

// POST: (...) -> modify sheets
// POST: (...) -> insert pg
// POST: (...) -> insert es
// *** all POSTs on link above (stuff already setup there :) 
