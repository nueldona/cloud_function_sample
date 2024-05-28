const allKeys = () => {
  const SENDGRID_API_KEY='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'
  const PAYSTACK_SECRET_KEY='sk_test_bfa4a9ef7b214b822bb01cd1e808a63d72010f79'
  const PAYSTACK_PUBLIC_KEY='pk_test_b24df9fdd2d7ab6085732f80a2f48d99f741edf3'

  return {
    SENDGRID_API_KEY,
    PAYSTACK_SECRET_KEY,
    PAYSTACK_PUBLIC_KEY
  };
};

exports.allKeys = allKeys;
