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

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    var data = JSON.parse(xhr.responseText);
    var items = data.items;
    var scores = data.scores;
    var list = document.querySelector('ul');
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

xhr.open("GET", "/items");
xhr.send();
