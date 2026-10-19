// Uygulama ürün verisini, kategorileri, form doğrulamasını ve politika sürümünü
// web sitesiyle paylaşır: hepsi kökteki src/data/ klasöründen okunur, kopyalanmaz.
// Metro varsayılan olarak yalnızca mobile/ klasörünü izlediği için o klasör eklenir.
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
config.watchFolders = [...config.watchFolders, path.resolve(__dirname, '../src/data')]

module.exports = config
