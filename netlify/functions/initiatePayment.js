const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { name, email, phone } = JSON.parse(event.body);
    const tran_id = 'YT_' + Date.now();

    // SSLCommerz Credentials (Sandbox)
    const params = new URLSearchParams();
    params.append('store_id', 'youtu698f610fcabe');
    params.append('store_passwd', 'youtu698f610fcabe@ssl');
    params.append('total_amount', '999.00');
    params.append('currency', 'BDT');
    params.append('tran_id', tran_id);
    
    // Redirect URLs - আপনার Netlify ডোমেইন অনুযায়ী এগুলো আপডেট করুন
    params.append('success_url', 'https://youtube-masterclass.netlify.app/thank-you.html');
    params.append('fail_url', 'https://youtube-masterclass.netlify.app/index.html');
    params.append('cancel_url', 'https://youtube-masterclass.netlify.app/index.html');
    
    params.append('cus_name', name);
    params.append('cus_email', email);
    params.append('cus_phone', phone);
    params.append('cus_add1', 'Dhaka');
    params.append('cus_city', 'Dhaka');
    params.append('cus_country', 'Bangladesh');
    params.append('product_name', 'YouTube Masterclass eBook');
    params.append('product_category', 'Digital Product');
    params.append('product_profile', 'non-physical-goods');
    
    // পাসিং ডাটা thank-you পেজের জন্য
    params.append('value_a', email);
    params.append('value_b', name);
    params.append('value_c', phone);

    const response = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
      method: 'POST',
      body: params,
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
        body: JSON.stringify({ error: 'SSLCommerz Error', details: result }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server Error', message: error.message }),
    };
  }
};
