const { ApplicationService, connect } = require("@sap/cds");

module.exports = class OrdersService extends ApplicationService {
  async init() {
    this.on("external", async (req) => {
      try {
        //print(process.env.DESTINATION)
        console.log("I'm in")
        //const devEnv = process.env.DEV_ENV;
        //const testEnv = process.env.TEST_ENV;
        //const prodEnv = process.env.PROD_ENV;

        //console.log('devEnv:', devEnv);
        //console.log('testEnv:', testEnv);
        //console.log('prodEnv:', prodEnv);
        const orders = await connect.to(process.env.DESTINATION);
        const data = await orders.tx(req).post("/orders", req.data);

        const tx = cds.tx(req);
        const srv = await cds.connect.to("OrdersService");
        const { Orders } = srv.entities;

        const result = await tx.send({
          query: INSERT.into(Orders, data),
        });

        const ids = [];
        for (const id of result) {
          ids.push(id);
        }

        return {
          affectedRows: result.valueOf(),
          orders: ids,
        };
      } catch (err) {
        throw err;
      }
    });

    await super.init();
  }
};
