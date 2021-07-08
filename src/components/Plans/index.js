import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';

import { selectUser } from '../../features/userSlice';
import db from '../../firebase';

import './styles.css';

function Plans() {
  const [products, setProducts] = useState([]);
  const [subscription, setSubscription] = useState(null);

  const user = useSelector(selectUser);
  
  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection('customers')
      .doc(user.uuid)
      .collection('checkout_sessions')
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        alert(`An error occurred! ${error.message}`);
      }

      if (sessionId) {
        const stripe = await loadStripe(
          process.env.REACT_APP_STRIPE_PUBLISH_KEY
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  useEffect(() => {
    db.collection('products')
      .where('active', '==', true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const pricesSnap = await productDoc.ref.collection('prices').get();
          pricesSnap.docs.forEach((priceDoc) => {
            products[productDoc.id].prices = {
              priceId: priceDoc.id,
              priceData: priceDoc.data(),
            };
          });
        });

        setProducts(products);
      });
  }, []);

  useEffect(() => {
    db.collection('customers')
      .doc(user.uuid)
      .collection('subscriptions')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (sub) => {
          setSubscription({
            role: sub.data().role,
            currentPeriodEnd: sub.data().current_period_end,
            currentPeriodStart: sub.data().current_period_start,
          });
        });
      });
  }, [user.uuid]);

  return (
    <div className="plans">
      {subscription && (
        <p>
          Renewal Date:{' '}
          {new Date(subscription?.currentPeriodEnd * 1000).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);
        return (
          <div
            className={`plans__plan ${
              isCurrentPackage && 'plans__plan--disabled'
            }`}
            key={productId}
          >
            <div className="plans__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Plans;
