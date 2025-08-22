sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "ui5/demo/app/model/models",
    "ui5/demo/app/model/formatter"],
    (Controller, Fragment, Sorter, Filter, models, formatter) => {
        'use strict'




        return Controller.extend('ui5.demo.app.controller.App', {
            
            formatter: formatter,
            _oDialogP : {},
            fragmentNames : {
                createProduct : "ui5.demo.app.view.fragments.CreateProduct",
                sortProduct   : "ui5.demo.app.view.fragments.SortDialog",
                groupProduct  : "ui5.demo.app.view.fragments.GroupDialog",
                filtreProduct : "ui5.demo.app.view.fragments.FilterDialog"
            },
           
            onPressProduct: async function () {

                if ( !this._validateInputData() ) return 

                const oInput = this.getView().getModel('input').getData();
                const oProduct = this.getView().getModel('product');

                const oItems = oProduct.getProperty('/items');

                oItems.push(oInput);
                oProduct.refresh()

                const oDialog = await this._openDialog(this.fragmentNames.createProduct);
                oDialog.close();


            },
            onPressDelete: function (oEvent) {
                const oItem = oEvent.getParameter("listItem")

                const oModel = this.getView().getModel("product")
                const oIndex = oItem.getBindingContext("product").getPath().split("/").pop();

                oModel.getData().items.splice(oIndex, 1);

                oModel.refresh();
            },
            
            onAfterClose: function(){
                this.getOwnerComponent().setModel(models.createProductModel() , "input");
                this.getOwnerComponent().setModel(models.validatePeoductModel(), "validate")
            },

            onPressAddNewProduct:async function () {
                const oDialog = await this._openDialog(this.fragmentNames.createProduct)
                oDialog.open()
            },
            onPressCancelNewProduct: async function () {
                const oDialog = await this._openDialog(this.fragmentNames.createProduct)
                oDialog.close();
               
            },
            onSortProduct: async function(){
                const oDialog = await this._openDialog(this.fragmentNames.sortProduct);
                oDialog.open()
            },
            onGroupProduct : async function(){
                const oDialog = await this._openDialog(this.fragmentNames.groupProduct);
                oDialog.open()
            },
            onFilterProduct : async function(){
                const oDialog = await this._openDialog(this.fragmentNames.filtreProduct);
                oDialog.open()
            },
            onConfirmSort: function(oEvent){
                const oItems = oEvent.getParameter("sortItem");
                const bDes = oEvent.getParameter("sortDescending");

                this.getView()
                    .byId("idProductList")
                    .getBinding("items")
                    .sort(
                        oItems ? [new Sorter(oItems.getKey() , bDes) ] : []
                    );
                console.log(
                    this.getView()
                    .byId("idProductList")
                    .getBinding("items")
                    
                )
            },
            onConfirmGroup : function(oEvent){
                const oGroupItems = oEvent.getParameter("groupItem");
                const bDes = oEvent.getParameter("groupDescending");
                this.getView()
                    .byId("idProductList")
                    .getBinding("items")
                    .sort(
                        oGroupItems ? [new Sorter(oGroupItems.getKey() , bDes , true) ] : []
                    );
                
            },
            onConfirmFilter: function(oEvent){
                const aFilterItems = oEvent.getParameter("filterItems");
                const aFilterString = oEvent.getParameter("filterString");
                console.log(aFilterString)
                
                const aFilter = [];

                aFilterItems.forEach(item =>{
                    const [sPath , oOerator , sValue1 , sValue2] = item.getKey().split('__');
                    aFilter.push(new Filter(sPath , oOerator , sValue1 , sValue2))
                })
                this.getView()
                    .byId("idProductList")
                    .getBinding("items")
                    .filter(aFilter)

                this.getView().byId("idFilterInfoToolbar").setVisible(aFilter.length > 0 ? true : false )
                this.getView().byId("idFilterText").setText(aFilterString)

            },
            _validateInputData: function () {
                const oInput = this.getView().getModel("input").getData();
                const oValidateModel = this.getView().getModel("validate");
                const oValidateData = oValidateModel.getData();

                oValidateModel.setProperty("/Name", !!oInput.Name);
                oValidateModel.setProperty("/Category", !!oInput.Category);
                oValidateModel.setProperty("/Price", !!oInput.Price);
                oValidateModel.setProperty("/ReleaseDate", !!oInput.ReleaseDate);
                oValidateModel.setProperty("/DiscontinuedDate", !!oInput.DiscontinuedDate);

                return Object.keys(oValidateData).every((key) => {
                    return oValidateData[key] === true
                });


            },
            _openDialog :async function(fragmentView,sDialogId){

                if(!!!this._oDialogP[fragmentView]){
                    this._oDialogP[fragmentView] = Fragment.load({
                        id : this.getView().createId(sDialogId),
                        name : fragmentView,
                        controller: this
                    }).then(oDlg => {
                        this.getView().addDependent(oDlg);
                        return oDlg;
                    })
                }
                
                return await this._oDialogP[fragmentView];

            }
        })
    })