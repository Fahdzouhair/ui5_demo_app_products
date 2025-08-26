sap.ui.define(["./BaseController",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "ui5/demo/app/model/models",
    "ui5/demo/app/model/formatter"],
    (BaseController, Fragment, MessageBox, Sorter, Filter, FilterOperator, models, formatter) => {
        'use strict'

        return BaseController.extend('ui5.demo.app.controller.Home', {

            formatter: formatter,
            _oDialogP: {},
            fragmentNames: {
                createProduct: "ui5.demo.app.view.fragments.CreateProduct",
                sortProduct: "ui5.demo.app.view.fragments.SortDialog",
                groupProduct: "ui5.demo.app.view.fragments.GroupDialog",
                filtreProduct: "ui5.demo.app.view.fragments.FilterDialog",
                editProduct: "ui5.demo.app.view.fragments.EditProduct"
            },

            onPressProduct: async function () {

                const oPlayload = this.getView().getModel('input').getData();
                if (!this._validateInputData()) return
                oPlayload.ID = Date.now().toString().slice(-4)

                delete oPlayload.Currency
                delete oPlayload.Category

                this.getView().getModel().create('/Products', oPlayload, {
                    success: (oData, oResponse) => {
                        console.log(oData, oResponse)
                    },
                    Error: err => {
                        console.log(err)
                    }
                })



                const oDialog = await this._openDialog(this.fragmentNames.createProduct);
                oDialog.close();


            },
            onPressEditProduct: async function () {
                const oView = this.getView()
                const oModel = this.getView().getModel()
                const sPath = this._oEditDialog.getBindingContext().getPath()


                const oPayload = {
                    Name: oView.byId("idProductNameEdit").getValue(),
                    Price: oView.byId("idPriceEdit").getValue(),
                    ReleaseDate: oView.byId("idReleaseDateEdit").getDateValue(),
                    DiscontinuedDate: oView.byId("idDiscontinuedDateEdit").getDateValue(),
                    Rating: oView.byId("idRatingEdit").getValue(),
                }

                oModel.update(sPath, oPayload, {
                    success: () => {
                        MessageBox.show("Product Updated !")
                        oModel.refresh();
                        this._oEditDialog.close()
                    },
                    error: err => {
                        console.log(err);
                        this._oEditDialog.close()

                    }

                })

                this._oEditDialog.close();

            },
            onPressItem: async function (oEvent) {

                /*                MessageBox.show(oEvent.getSource().getBindingContext().getProperty("Description"), {
                                    title: "Description"
                                })
                */

                const sPath = oEvent.getSource().getBindingContext().getPath()

                /*                
                                this.getView().getModel().read(sPath,{
                                    success: (oData) =>{
                                        MessageBox.show(oData.Description , { title : "Description" })
                                    },
                                    Error: err => console.log(err)
                                })
                */
                //console.log(this.getView().getModel().getProperty(`${sPath}/Name`))
                const oDialog = await this._openDialog(this.fragmentNames.editProduct)
                oDialog.bindElement({
                    path: sPath
                })
                oDialog.open();
                this._oEditDialog = oDialog
            },
            onPressItem2(oEvent){
                
                this.getRouter().navTo('detail' ,{
                    productID : oEvent.getSource().getBindingContext().getProperty('ID')
                })
            },
            onProductLoaded: function (oEvent) {
                let sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("listHeader");
                sTitle = `${sTitle} (${oEvent.getParameter("total")})`;

                this.getView().byId("idListTitle").setText(sTitle);
            },
            onPressDelete: function (oEvent) {
                const oItem = oEvent.getParameter("listItem")
                const oModel = this.getView().getModel()
                const sPath = oItem.getBindingContext().getPath()

                oModel.remove(sPath, {
                    success: () => {
                        MessageBox.information(`Product ${sPath.slice(10, sPath.length - 1)} Deleted`)
                    },
                    error: () => MessageBox.error("Product Does not deleted !")
                })

                oModel.refresh();
            },

            onAfterClose: function () {
                this.getOwnerComponent().setModel(models.createProductModel(), "input");
                this.getOwnerComponent().setModel(models.validatePeoductModel(), "validate")
            },

            onPressAddNewProduct: async function () {
                const oDialog = await this._openDialog(this.fragmentNames.createProduct)
                oDialog.open()
            },
            onPressCancelNewProduct: async function () {
                const oDialog = await this._openDialog(this.fragmentNames.editProduct)
                oDialog.close();

            },
            onSortProduct: async function () {
                const oDialog = await this._openDialog(this.fragmentNames.sortProduct);
                oDialog.open()
            },
            onGroupProduct: async function () {
                const oDialog = await this._openDialog(this.fragmentNames.groupProduct);
                oDialog.open()
            },
            onFilterProduct: async function () {
                const oDialog = await this._openDialog(this.fragmentNames.filtreProduct);
                oDialog.open()
            },
            onConfirmSort: function (oEvent) {
                const oItems = oEvent.getParameter("sortItem");
                const bDes = oEvent.getParameter("sortDescending");

                this.getView()
                    .byId("idProductList")
                    .getBinding("items")
                    .sort(
                        oItems ? [new Sorter(oItems.getKey(), bDes)] : []
                    );
            },
            onConfirmGroup: function (oEvent) {
                const oGroupItems = oEvent.getParameter("groupItem");
                const bDes = oEvent.getParameter("groupDescending");
                this.getView()
                    .byId("idProductList")
                    .getBinding("items")
                    .sort(
                        oGroupItems ? [new Sorter(oGroupItems.getKey(), bDes, true)] : []
                    );

            },
            onConfirmFilter: function (oEvent) {
                const aFilterKeys = oEvent.getParameter("filterCompoundKeys")
                const aFilterString = oEvent.getParameter("filterString");


                const aFilter = [];

                Object.entries(aFilterKeys).forEach(([sPath, oValues]) => {
                    Object.keys(oValues).forEach(sKey => {
                        if (sKey.includes("__")) {
                            aFilter.push(new Filter(...sKey.split("__")))
                        } else {
                            aFilter.push(new Filter(sPath, FilterOperator.EQ, sKey))
                        }
                    })
                })

                this.getView()
                    .byId("idProductList")
                    .getBinding("items")
                    .filter(aFilter)

                this.getView().byId("idFilterInfoToolbar").setVisible(aFilter.length > 0 ? true : false)
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
            _openDialog: async function (fragmentView, sDialogId) {

                if (!!!this._oDialogP[fragmentView]) {
                    this._oDialogP[fragmentView] = Fragment.load({
                        id: this.getView().getId(),
                        name: fragmentView,
                        controller: this
                    }).then(oDlg => {
                        this.getView().addDependent(oDlg);
                        return oDlg;
                    })

                    return await this._oDialogP[fragmentView];

                } else {
                    return this._oDialogP[fragmentView];
                }

            }
        })
    })