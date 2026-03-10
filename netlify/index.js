const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const cors = require('cors')({origin: true});  // এই লাইন যোগ করুন

admin.initializeApp();
const db = admin.firestore();

exports.initiatePayment = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {  // cors মিডলওয়্যার র‍্যাপ করুন
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { name, email, phone } = req.body;
    const tran_id = 'YT_' + Date.now() + Math.floor(Math.random() * 1000);

    const postData = {
      store_id: 'youtu698f610fcabe',
      store_passwd: 'youtu698f610fcabe@ssl',
      total_amount: '999.00',
      currency: 'BDT',
      tran_id: tran_id,
      success_url: 'https://saydur074430-blip.github.io/youtube_masterclass.com/thank-you.html',  // আপনার আসল ডোমেইন
      fail_url: 'https://saydur074430-blip.github.io/youtube_masterclass.com/index.html',
      cancel_url: 'https://saydur074430-blip.github.io/youtube_masterclass.com/index.html',
      cus_name: name,
      cus_email: email,
      cus_phone: phone,
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_postcode: '1200',
      cus_country: 'Bangladesh',
      product_category: 'eBook',
      shipping_method: 'NO',
      num_of_item: '1',
      product_name: 'YouTube Income Guide',
      product_profile: 'general',
      value_a: email,
      value_b: name,
      value_c: phone
    };

    try {
      // Pending order store
      await db.collection('orders').doc(tran_id).set({
        tran_id, name, email, phone, amount: '999', status: 'pending', createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const response = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
        method: 'POST',
        body: new URLSearchParams(postData),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const result = await response.json();

      if (result.GatewayPageURL) {
        res.json({ status: 'success', url: result.GatewayPageURL });
      } else {
        res.status(400).json(result);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
});
