
# Component architecture

```mermaid
stateDiagram-v2

%% Sets the order of components: %%

    App.vue
    BiobankExplorerContainer.vue 
    FilterContainer.vue
    Search
    Covid19
    Covid19Services
    DiagnosisAvailableFilter.vue
    GenericFilters
    Countries
    ResultHeader.vue
    ActiveFilterList.vue
    Negotiator.vue
    BiobankCard.vue
    BiobankCardsContainer.vue
    CollectionsTable.vue
    CollectionReportCard.vue
    QualityColumn.vue
    SubCollectionsTable.vue
    NetworkReportCard.vue
    ReportDescription.vue
    ReportDetailsList.vue
    ReportCollection.vue
    ReportTitle.vue

State ReportComponents {

    ReportTitle.vue
    ReportDetailsList.vue
    ReportDescription.vue
    ReportCollection.vue
    ReportSubCollection.vue
}

%% Set relations: %%

App.vue --> BiobankExplorerContainer.vue

BiobankExplorerContainer.vue -->  FilterContainer.vue
BiobankExplorerContainer.vue -->  ResultHeader.vue
BiobankExplorerContainer.vue -->  Negotiator.vue
BiobankExplorerContainer.vue -->  BiobankCardsContainer.vue

FilterContainer.vue --> Search : String
FilterContainer.vue --> Covid19 : Checkbox
FilterContainer.vue --> Covid19Services : Checkbox
FilterContainer.vue --> GenericFilters : String / Checkbox
FilterContainer.vue --> Countries
FilterContainer.vue --> DiagnosisAvailableFilter.vue

ResultHeader.vue --> ActiveFilterList.vue

BiobankCardsContainer.vue --> BiobankCard.vue 

BiobankCard.vue --> BiobankReportCard.vue : Vue Router Link
BiobankCard.vue --> CollectionsTable.vue


BiobankReportCard.vue --> ReportComponents
BiobankReportCard.vue --> NetworkReportCard.vue : Vue Router Link
CollectionReportCard.vue --> ReportComponents
CollectionReportCard.vue --> NetworkReportCard.vue : Vue Router Link
NetworkReportCard.vue --> ReportComponents

ReportCollection.vue --> ReportSubCollection.vue
ReportSubCollection.vue --> ReportSubCollection.vue : Parent - Child Relation
ReportSubCollection.vue --> CollectionReportCard.vue : Vue Router Link
ReportSubCollection.vue --> ReportDetailsList.vue

ReportDetailsList.vue --> ?_ReportCard : Dynamic Router Link

CollectionsTable.vue -->  CollectionReportCard.vue : Vue Router Link
CollectionsTable.vue -->  QualityColumn.vue
CollectionsTable.vue -->  SubCollectionsTable.vue

SubCollectionsTable.vue --> SubCollectionsTable.vue : Parent - Child Relation
SubCollectionsTable.vue --> CollectionReportCard.vue : Vue Router Link

%% Notes %%

note left of Countries: Can be turned off through options
note right of ActiveFilterList.vue: Chips indicating active filters and their value
note left of GenericFilters: Generic filters based on JSON
note left of BiobankCardsContainer.vue: Renders biobanks as BiobankCard
note right of Negotiator.vue: Button to Request data

```
# Store architecture

## Getters


### Biobank
The biobank getter has two return types:
First it returns a string array with biobank ids, which then can be accessed in the biobankcardscontainer.vue
which triggers loading of the biobank objects.

## State

### collectionIds

This is actually a form of dictionary that has object with a collectionId and a biobankId
which is being filtered, based on what the user has selected


### biobankIds

Some specific filters are on biobanks, this property is being used for that.
e.g. covid19


# 3rd party components

- vue-loading-overlay { spinner }
- vue-multiselect
- vue-analytics
- bootstrap-vu
- array-flat-polyfill

# Tools used to create this document

- Visual Studio Code

- https://mermaid-js.github.io/mermaid/#/README

- https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid

## Create SVG for diagram

Copy the diagram without the code block to an mmd file, then run the mermaid cli

- https://github.com/mermaidjs/mermaid.cli