import {BadRequest,} from '../../../libs/errors';
import amzLib from '../../../libs/payments/amazon';
import {authWithHeaders,} from '../../../middlewares/auth';
import shared from '../../../../common';

const api = {};

/**
 * @apiIgnore Payments are considered part of the private API
 * @api {post} /amazon/verifyAccessToken Amazon Payments: verify access token
 * @apiName AmazonVerifyAccessToken
 * @apiGroup Payments
 *
 * @apiSuccess {Object} data Empty object
 * */
api.verifyAccessToken = {
  method: 'POST',
  url: '/amazon/verifyAccessToken',
  middlewares: [authWithHeaders()],
  async handler (req, res) {
    const accessToken = req.body.access_token;

    if (!accessToken) throw new BadRequest('Missing req.body.access_token');

    await amzLib.getTokenInfo(accessToken);

    res.respond(200, {});
  },
};

/**
 * @apiIgnore Payments are considered part of the private API
 * @api {post} /amazon/createOrderReferenceId Amazon Payments: create order reference id
 * @apiName AmazonCreateOrderReferenceId
 * @apiGroup Payments
 *
 * @apiSuccess {String} data.orderReferenceId The order reference id.
 * */
api.createOrderReferenceId = {
  method: 'POST',
  url: '/amazon/createOrderReferenceId',
  middlewares: [authWithHeaders()],
  async handler (req, res) {
    const { billingAgreementId } = req.body;

    if (!billingAgreementId) throw new BadRequest('Missing req.body.billingAgreementId');

    const response = await amzLib.createOrderReferenceId({
      Id: billingAgreementId,
      IdType: 'BillingAgreement',
      ConfirmNow: false,
    });

    res.respond(200, {
      orderReferenceId: response.OrderReferenceDetails.AmazonOrderReferenceId,
    });
  },
};

/**
 * @apiIgnore Payments are considered part of the private API
 * @api {post} /amazon/checkout Amazon Payments: checkout
 * @apiName AmazonCheckout
 * @apiGroup Payments
 *
 * @apiSuccess {Object} data Empty object
 * */
api.checkout = {
  method: 'POST',
  url: '/amazon/checkout',
  middlewares: [authWithHeaders()],
  async handler (req, res) {
    const { user } = res.locals;
    const { orderReferenceId, gift, gemsBlock } = req.body;

    if (!orderReferenceId) throw new BadRequest('Missing req.body.orderReferenceId');

    await amzLib.checkout({
      gemsBlock, gift, user, orderReferenceId, headers: req.headers,
    });

    res.respond(200);
  },
};

/**
 * @apiIgnore Payments are considered part of the private API
 * @api {post} /amazon/subscribe Amazon Payments: subscribe
 * @apiName AmazonSubscribe
 * @apiGroup Payments
 *
 * @apiSuccess {Object} data Empty object
 * */
api.subscribe = {
  method: 'POST',
  url: '/amazon/subscribe',
  middlewares: [authWithHeaders()],
  async handler (req, res) {
    const { billingAgreementId } = req.body;
    const sub = req.body.subscription
      ? shared.content.subscriptionBlocks[req.body.subscription]
      : false;
    const { coupon } = req.body;
    const { user } = res.locals;
    const { groupId } = req.body;

    await amzLib.subscribe({
      billingAgreementId,
      sub,
      coupon,
      user,
      groupId,
      headers: req.headers,
    });

    res.respond(200);
  },
};

/**
 * @apiIgnore Payments are considered part of the private API
 * @api {get} /amazon/subscribe/cancel Amazon Payments: subscribe cancel
 * @apiName AmazonSubscribe
 * @apiGroup Payments
 * */
api.subscribeCancel = {
  method: 'GET',
  url: '/amazon/subscribe/cancel',
  middlewares: [authWithHeaders()],
  async handler (req, res) {
    const { user } = res.locals;
    const { groupId } = req.query;

    await amzLib.cancelSubscription({ user, groupId, headers: req.headers });

    if (req.query.noRedirect) {
      res.respond(200);
    } else {
      res.redirect('/');
    }
  },
};

export default api;
