const path = require('path');
const UserDto = require('./dtos/userDTO');
const tokenService = require('./services/tokenService');

module.exports = {
    getView (view) {
        return path.normalize(`${__dirname}/../views/pages/${view}.ejs`);
    },

    async saveToken (user) {
        const userDto = new UserDto(user.rows[0]);
        const tokens = tokenService.generateTokens({...userDto});
    
        await tokenService.seveTokens(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    },

    comparison: class CalculateStrComparison {
        constructor (levenshtein) {
            this.levenshtein = levenshtein;
        }
    
        #clearStr (str) {
            let arr = str.split(' ').map( word => word.toLowerCase())
            const regex = /[A-Za-z0-9_]+/;
            
            let pureArr = arr.filter( word => {
                if (word.length >= 3 & regex.test(word)) return true;
            });
        
            return { text: pureArr.join(' '), arr: pureArr };
        };
    
        #checkSuitable (substr, str) {
            let result = [];
        
            substr.arr.forEach( subWord => {
                let arr = [];
        
                str.arr.forEach( word => {
                    arr.push([ this.levenshtein.get(subWord, word, { useCollator: true }), word, subWord ])
                });
    
                result.push(arr.sort( (a, b) => a[0] - b[0])[0])
            });
        
            return { separately: result, general: this.levenshtein.get(substr.text, str.text) };
        };
    
        get (substr, str, id) {
            substr = this.#clearStr(substr.toLowerCase());
            str = this.#clearStr(str.toLowerCase());
    
            const { separately, general } = this.#checkSuitable(substr, str);
            let sumSep = 0;
            
            separately.forEach( arr => {
                sumSep += arr[0];
            })
            console.log(separately, general, id);
            const diff = general - sumSep;
            return general / (diff === 0 ? 1 : diff);
        }
    }
}

