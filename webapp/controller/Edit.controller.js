sap.ui.define(["./BaseController"], (BaseController) => {
    'use strict'

    return BaseController.extend("ui5.demo.app.controller.Edit", {

        onInit(){

        },

        onPressSaveProduct() {

            const oModel = this.getView().getModel()
            oModel.setUseBatch(true)

            if (oModel.hasPendingChanges()) {
                oModel.submitChanges({
                    success: () => {
                        MessageBox.show("Product Updated !")
                        oModel.refresh();
                        this.getRouter().navTo('detail')
                        oModel.setUseBatch(false)
                    },
                    error: err => {
                        console.log(err.message);
                        this.getRouter().getTargets().display("targetDetail")

                    }
                })
            } else {
                this.getRouter().getTargets().display("targetDetail")
            }
        },
        onPressCancelEditProduct() {
            //this.getRouter().navTo('detail', {}, true)
            this.getRouter().getTargets().display('targeDetail')
        }
    })
})