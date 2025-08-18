sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/ObjectListItem",
    "sap/m/ObjectAttribute",
    "sap/m/ObjectStatus",
    "sap/ui/core/library",
    "sap/ui/core/Fragment"],
    (Controller, ObjectListItem, ObjectAttribute, ObjectStatus, coreLibrary,Fragment) => {
        'use strict'
        
        const { ValueState } = coreLibrary;

        return Controller.extend('ui5.demo.app.controller.App', {
            onPressProduct: function () {
                const oBundel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                const sProductName = this.getView().byId("productNameID").getValue();
                const sCategory = this.getView().byId("idCategory").getSelectedItem().getText();
                const sProductPrice = this.getView().byId("priceProductID").getValue();
                const sReleaseDate = this.getView().byId("releaseDateID").getValue();
                const sDiscountinuedDate = this.getView().byId("discountingDateID").getValue();

                const newObject = new ObjectListItem({
                    title: sProductName,
                    number: sProductPrice,
                    numberUnit: "EUR",
                    attributes: [
                        new ObjectAttribute({ title: "Category", text: sCategory }),
                        new ObjectAttribute({ title: oBundel.getText('category'), text: sReleaseDate })]
                    ,
                    firstStatus: new ObjectStatus({
                        text: this._getAvailabilityText(sReleaseDate),
                        state: this._getAvailabilityStatus(sReleaseDate)
                    })
                })

                this.getView().byId("listID").addItem(newObject);
            },
            onDeleteListItem: function (oEvent) {
                const sList = oEvent.getSource();
                sList.removeItem(oEvent.getParameter("listItem"));
            },
            _getAvailabilityText(oDate) {
                return oDate > new Date().toLocaleDateString() ? "Available" : "Unavailable";
            },
            _getAvailabilityStatus(oDate) {
                return oDate > new Date() ? ValueState.Success : ValueState.Error;
            },
            onPressAddNewProduct: function(){
                if(!this._oCreateProductDialog){
                    Fragment.load({
                        id:this.getView().getId(),
                        name:"ui5.demo.app.view.fragments.CreateProduct",
                        controller: this
                    }).then(oDialog=>{
                        this._oCreateProductDialog = oDialog
                        this.getView().addDependent(oDialog)
                        oDialog.open()
                    })
                }else{
                    this._oCreateProductDialog.open()
                }
            },
            onPressCancelNewProduct: function(){
                this._oCreateProductDialog.close()
            }
        })
    })