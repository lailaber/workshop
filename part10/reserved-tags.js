import { group } from 'k6'
import http from 'k6/http'
import * as helper from './helper-10.js';

export const options = {
  cloud: {
    distribution: { 'amazon:de:frankfurt': { loadZone: 'amazon:de:frankfurt', percent: 100 } },
  },
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 5, duration: '30s' },
        { target: 5, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
      exec: 'reservedLogin',
    },
  },
}

export function reservedLogin() {
  let getCustomerAccountLoginPageRequest = {
    method: 'GET',
    url: 'https://www.reserved.com/gb/en/customer/account/login/',
    params: {
      tags: {
        name: 'RE - Get Customer Account Login Page',
      },
    },
  }

  let getVarnishAjaxNewIndexRequest = {
    method: 'GET',
    url: 'https://www.reserved.com/gb/en/varnish/ajax/newindex/?1726864558415',
    params: {
      tags: {
        name: 'RE - Get Varnish New Indes',
      },
    },
  }

  let getVarnishAjaxIndexRequest = {
    method: 'GET',
    url: 'https://www.reserved.com/gb/en/varnish/ajax/index/?1726864558424',
    params: {
      tags: {
        name: 'RE - Get Varnish Index',
      },
    },
  }

  let postPageInfoRequest = {
    method: 'POST',
    url: 'https://www.reserved.com/gb/en/varnish/ajax/index/?1726864558424',
    params: {
      tags: {
        name: 'RE - Post Page Info',
      },
    },
  }

  function postCustomerLoginRequest(form_key) {
    return {
      method: 'POST',
      url: 'https://www.reserved.com/gb/en/ajx/customer/login/referer/aHR0cHM6Ly93d3cucmVzZXJ2ZWQuY29tL2diL2VuLw,,/uenc/aHR0cHM6Ly93d3cucmVzZXJ2ZWQuY29tL2diL2VuLw,,/?lpp_new_login',
      body: {
        'login[username]': 'performancetests0001@wp.pl',
        'login[password]': 'Qweasd12@',
        'login[remember_me]': '1',
        form_key: form_key
      },
      params: {
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        tags: {
          name: 'RE - Post Customer Login',
        },
      }
    };
  }

  let getMainPageRequest = {
    method: 'GET',
    url: 'https://www.reserved.com/gb/en/',
    params: {
      tags: {
        name: 'RE - Get Main Page',
      },
    }
  }

  group('Login Page - https://www.reserved.com/gb/en/customer/account/login/#login', function () {
    let getCustomerAccountLoginPageResponse = http.get(getCustomerAccountLoginPageRequest.url, getCustomerAccountLoginPageRequest.params);
    let formKey = helper.getFormKey(getCustomerAccountLoginPageResponse)

    http.get(getVarnishAjaxNewIndexRequest.url, getVarnishAjaxNewIndexRequest.params)

    http.get(getVarnishAjaxIndexRequest.url, getVarnishAjaxIndexRequest.params)

    http.post(postPageInfoRequest.url, null, postPageInfoRequest.params)

    http.post(postCustomerLoginRequest().url, postCustomerLoginRequest(formKey).body, postCustomerLoginRequest().params)
  })

  group('Main Page After User Log In - https://www.reserved.com/gb/en/', function () {
    http.get(getMainPageRequest.url, getMainPageRequest.params);

    http.get(getVarnishAjaxNewIndexRequest.url, getVarnishAjaxNewIndexRequest.params)

    http.get(getVarnishAjaxIndexRequest.url, getVarnishAjaxIndexRequest.params)

    http.post(postPageInfoRequest.url, null, postPageInfoRequest.params)
  })
}
