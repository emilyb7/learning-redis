function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) { resolve(req.response); }
      else { reject(Error(req.statusText)); }
    };

    req.onerror = function() { reject(Error("Network Error")); };

    req.send();
  });
}

get('/items').then(function(response) {
  var data = JSON.parse(response);
  var items = data.items;
  var scores = data.scores;
  var itemList = items.filter(function(item) {
    return !!item;
  }).map(function(item, index){
    var listItem = document.createElement('li');
    listItem.textContent = item;
    listItem.id = scores[index];
    listItem.addEventListener("click", remove);
    return listItem;
  })
  itemList.forEach(function(item) { document.querySelector('ul').appendChild(item); });
}, function(error) {
  console.error("Failed!", error);
})

function remove () {
  var item = this.id;
  var list =  document.querySelector('ul');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  var removeRequest = new XMLHttpRequest();
  removeRequest.onreadystatechange = function () {
    if (removeRequest.readyState == 4 && removeRequest.status == 200) {
      var data = JSON.parse(removeRequest.responseText);
      var items = data.items;
      var scores = data.scores;
      items.forEach(function(item, index) {
        if (item) {
          var listItem = document.createElement('li');
          listItem.textContent = item;
          listItem.id = scores[index];
          list.appendChild(listItem);
          listItem.addEventListener("click", remove);
        }
      });

    }
  }
  removeRequest.open("POST", "/remove", true);
  removeRequest.send(JSON.stringify({ item: item, }));
}
