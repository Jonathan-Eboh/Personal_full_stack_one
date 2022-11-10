var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var cart = document.getElementsByClassName("fa-cart-plus");
var payment = document.getElementsByClassName("fa-money");
//console.log(cart);


Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp': thumbUp
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});

//add to cart
Array.from(cart).forEach(function (element) {
  element.addEventListener('click', function () {
    const itemTitle = this.parentNode.parentNode.childNodes[1].innerText
    const itemId = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)//document.getElementById("storeItemId").value


    fetch('cartAdd', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'item': itemTitle.trim(),
        'itemID': itemId
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});


//pay for item in cart
Array.from(payment).forEach(function (element) {
  element.addEventListener('click', function () {
    const item = this.parentNode.parentNode.childNodes[1].innerText
    // const msg = this.parentNode.parentNode.childNodes[3].innerText
    // const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('payForItem', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'item': item.trim()
        // 'msg': msg,
        // 'thumbUp': thumbUp
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});

//delete from cart
Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const item = this.parentNode.parentNode.childNodes[1].innerText
    console.log("Client side item delete", item); //this is the correct task

    // const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('cartRemove', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'item': item.trim(),
        // 'msg': msg
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
