export const groupCollectionsByBiobankId = function (collectionidWithBiobankId) {
  const collectionsPerBiobank = {}

  for (const collectionWithBiobank of collectionidWithBiobankId) {
    if (Object.prototype.hasOwnProperty.call(collectionsPerBiobank, collectionWithBiobank.biobankId)) {
      collectionsPerBiobank[collectionWithBiobank.biobankId].push(collectionWithBiobank.collectionId)
    } else {
      collectionsPerBiobank[collectionWithBiobank.biobankId] = [collectionWithBiobank.collectionId]
    }
  }
  return collectionsPerBiobank
}

export const groupCollectionsByNetworkId = function (collectionsWithNetworkId) {
  const collectionsPerNetwork = {}
  collectionsWithNetworkId.forEach(collection => {
    collection.networkIds.forEach(networkId => {
      if (!(networkId in collectionsPerNetwork)) {
        collectionsPerNetwork[networkId] = [collection]
      } else {
        collectionsPerNetwork[networkId].push(collection)
      }
    })
  })
  return collectionsPerNetwork
}

export const groupBiobanksByNetworkId = function (biobanks, biobankInfo) {
  const biobanksPerNetwork = {}
  biobanks.forEach(biobank => {
    biobankInfo[biobank.id || biobank].networkIds.forEach(networkId => {
      if (!(networkId in biobanksPerNetwork)) {
        biobanksPerNetwork[networkId] = [biobank]
      } else {
        biobanksPerNetwork[networkId].push(biobank)
      }
    })
  })
  return biobanksPerNetwork
}
