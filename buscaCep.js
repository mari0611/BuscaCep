'use strict';

const _              = require('lodash');
const requestPromise = require('request-promise'),
      syncRequest = require('sync-request');


VIACEP_URI = config.apiViaCep.url;

const config = {
    apiViaCep: {
        url: 'https://viacep.com.br'
    }
};
     
const callViaCep = (cep, options) => {
  let requestOptions = {
    json: true,
    url: `${VIACEP_URI}/ws/${cep}/json`,
    
  };
  return requestPromise(requestOptions);
}

const cepInvalido = cep => {
  return !cep;
}


const mensagemErro = () => {
  return 'CEP não encontrado. Por favor, verifique os dados inseridos.';
}

const obterDadosSy = (cep) => {
  let ret;
  try {
    if (cepInvalido(cep)) {
      throw new Error(mensagemErro());
    }
    ret = syncRequest('GET', `${VIACEP_URI}/ws/${cep}/json`);
    ret = JSON.parse(ret.getBody());
  } catch(e) {
    ret = {
      hasError: true,
      statusCode: e.statusCode,
      message: e.message
    };
  }
  
  return ret;
}

const obterDadosAsync = (cep, options) => {
   return new Promise((resolve, reject) => {
    if (cepInvalido(cep)) {
      reject({ message: mensagemErro() });
    } else {
      callViaCep(cep, options)
        .then(placeInfo => {
          resolve(placeInfo);
        })
        .catch(err => {
          reject( {statusCode: err.statusCode, message: err.error});
        });
    }
  });
}

module.exports = function getDetailsByZipCode (cep, options) {
  if (!_.isEmpty(cep)) {
    cep = cep.replace(/[-\s]/g, '');
  }
  return (options === true || (options && options.sync)) ?
    obterDadosSy(cep) :
    obterDadosAsync(cep, options);
};