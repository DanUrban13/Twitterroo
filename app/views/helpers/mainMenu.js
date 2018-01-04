module.exports = (adminuser, options) => {
  if(adminuser === 'joseph@quimby.com') {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
}