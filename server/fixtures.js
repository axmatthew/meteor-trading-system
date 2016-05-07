if (Counters.find({}).count() === 0) {
  Counters.insert({
    _id: "enquiryNum",
    seq: 1123
  });
}
if (Configs.find({}).count() === 0) {
  Configs.insert({
	  GSYS_ACCOUNT: "master",
	  GSHEET_ID: "1VZJiAOtF9OYTT6l3ZswSuUDlMF9qECKdH0wUHGoGVyQ",
	  PRODUCTS_GID: "2092508452",
	  SALES: ["Dawson", "Matthew", "Mike", "Penny"],
	  PURCHASES: ["Eva", "Lucy", "Dawson", "Matthew", "Mike", "Penny"],
    TASK_TITLES: ["quote", "follow quote", "prepare sample", "send sample", "ask for deadline", "call follow up", "email follow up", "other 1", "other 2"]
  });
}

Enquiries.remove({ date: { $lt: new Date('2015-01-01') } });
PurchaseOrders.remove({ poNum: { $regex:/^P14/ }, status: "Done" });