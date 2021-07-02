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
      // A copy of the biobank is needed for cases where collections of the same biobanks are part
      // of different networks
      // e.g. biobank B is not part of any network directly. It has two collections C1 and C2 one part
      // of network N1 and one of network N2. In this case in N1, B should appear only with C1,
      // while in N2, B should appear with only C2. If the object is not a copy, B would appear in both
      // networks with all its collections
      if (!(networkId in biobanksPerNetwork)) {
        biobanksPerNetwork[networkId] = typeof biobank === 'string' ? [biobank] : [{ ...biobank }]
      } else {
        biobanksPerNetwork[networkId].push(typeof biobank === 'string' ? biobank : { ...biobank })
      }
    })
  })
  return biobanksPerNetwork
}
