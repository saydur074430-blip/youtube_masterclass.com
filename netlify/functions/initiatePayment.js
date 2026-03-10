const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS হ্যান্ডলিং
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // প্রি-ফ্লাইট রিকোয়েস্ট চেক
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, email, phone } = JSON.parse(event.body);
    const tran_id = 'YT_' + Date.now() + Math.floor(Math.random() * 1000);

    // SSLCommerz ডাটা (আপনার index.js থেকে নেওয়া)
    const postData = new URLSearchParams({
      store_id: 'youtu698f610fcabe',
      store_passwd: 'youtu698f610fcabe@ssl',
      total_amount: '999.00',
      currency: 'BDT',
      tran_id: tran_id,
      success_url: 'https://saydur074430-blip.github.io/youtube_masterclass.com/thank-you.html',
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
    });

    // SSLCommerz API কল
    const response = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
      method: 'POST',
      body: postData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const result = await response.json();

    if (result.GatewayPageURL) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'success', url: result.GatewayPageURL }),
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(result),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
