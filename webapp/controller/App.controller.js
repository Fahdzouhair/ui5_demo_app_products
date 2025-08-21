sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "ui5/demo/app/model/formatter"],
    (Controller, Fragment, formatter) => {
        'use strict'


        

        return Controller.extend('ui5.demo.app.controller.App', {
            formatter : formatter, 
            onPressProduct: function () {
                const oInput = this.getView().getModel('input').getData();
                const oProduct = this.getView().getModel('product');

                const oItems = oProduct.getProperty('/items');

                oItems.push(oInput);
                oProduct.refresh()

                this._oCreateProductDialog.close();


            },
            onPressDelete: function (oEvent) {
                const oItem = oEvent.getParameter("listItem")

                const oModel = this.getView().getModel("product")
                const oIndex = oItem.getBindingContext("product").getPath().split("/").pop();

                oModel.getData().items.splice(oIndex, 1);

                oModel.refresh();
            },


            onPressAddNewProduct: function () {
                if (!this._oCreateProductDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "ui5.demo.app.view.fragments.CreateProduct",
                        controller: this
                    }).then(oDialog => {
                        this._oCreateProductDialog = oDialog
                        this.getView().addDependent(oDialog)
                        oDialog.open()
                    })
                } else {
                    this._oCreateProductDialog.open()
                }
            },
            onPressCancelNewProduct: function () {
                this._oCreateProductDialog.close()
            }
        })
    })