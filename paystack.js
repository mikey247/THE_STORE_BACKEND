const paystack = (request) => {
  // const MySecretKey = 'Bearer sk_test_xxxx';
  // sk_test_xxxx to be replaced by your own secret key
  const initializePayment = (form, mycallback) => {
    const options = {
      //
      url: "https://api.paystack.co/transaction/initialize",
      headers: {
        authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      form,
    };
    //
    const callback = (error, response, body) => {
      return mycallback(error, body);
    };

    request.post(options, callback);
  };

  const verifyPayment = (ref, mycallback) => {
    //
    const options = {
      url:
        "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
      headers: {
        authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    };
    console.log(options.url);
    //

    const callback = (error, response, body) => {
      return mycallback(error, body);
    };
    //

    request(options, callback);
  };

  return { initializePayment, verifyPayment };
};

module.exports = paystack;
