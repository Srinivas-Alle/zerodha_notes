chrome.runtime.sendMessage({ action: "show" });
setTimeout(function() {
  {
    var children;
    var popuphtml;
    function addNotes() {
      children = $(".vddl-list").children(".vddl-draggable");
      popuphtml =
        "<div class='popup_content'><span class='pupup_close'>X</span> " +
        "<div class='buy-info'><div class='left'><span class='bold'>Buy date:</span><span><input class='date-picker' id='datePicker' type ='date'/></span> </div><div class='right' style='width:120px;'><span class='bold'>duration: </span> <span id='duration'></span> days</div><div class='clear'></div></div>" +
        "<textarea placeholder =' QOQ details \n YOY details \n technial pattern \n Stop loss' class='content_editable' contenteditable='true'></textarea>" +
        "<div> <button class='delete_btn'>Delete</button></div> </div>";
      chrome.storage.sync.get(function(data) {
        for (var k = 0; k < children.length; k++) {
          if (data[$($(children[k]).find(".nice-name")).text()] !== undefined) {
            if ($(children[k]).find(".ext_tooltip").length == 0) {
              $(children[k])
                .find(".symbol")
                .prepend('<span class="ext_tooltip">i</span>');
            }
          }
        }
      });

      $(children)
        .find(".symbol")
        .bind("mouseover", function(event) {
          if ($(this).find(".ext_tooltip").length == 0)
            $(this).prepend('<span class="ext_tooltip">i</span>');
        });

      $(children)
        .find(".symbol")
        .on("mouseleave", function(event) {
          var key = $(event.currentTarget)
            .find(".nice-name")
            .text();
          chrome.storage.sync.get(key, function(data) {
            if ($.isEmptyObject(data)) {
              $(event.currentTarget)
                .find(".ext_tooltip")
                .remove();
            }
          });
        });
    }
    addNotes();
    // $(children).find('.symbol').prepend("<span class=\"ext_tooltip\">i</span>");
    function storeDataInMemory(event) {
      var key = $(event.target)
        .parents(".symbol")
        .find(".nice-name")
        .text();
      var obj = {};
      obj[key] = {
        date: $(event.target)
          .parents(".symbol")
          .find("#datePicker")
          .val(),
        message: $(event.target)
          .parents(".symbol")
          .find(".content_editable")
          .val()
      };
      console.log(obj);
      chrome.storage.sync.set(obj, function(val) {});
    }

    $(document).on("keyup", ".content_editable", function(event) {
      storeDataInMemory(event);
    });

   
    function setMaxDateForDatePicker(event) {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }

      today = yyyy + "-" + mm + "-" + dd;
      $(".date-picker").attr("max", today);
    }

    $(document).on("blur", "#datePicker", function(event) {
      var date = new Date();
      var choosenVal = $(event.target).val();
      var choosenDate = new Date(choosenVal);
      if (isNaN(choosenDate.getTime())) return;
      var timeDiff = Math.abs(choosenDate.getTime() - date.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      $(event.target)
        .parents(".symbol")
        .find("#duration")
        .text(diffDays);
      storeDataInMemory(event);
      //alert(diffDays)
    });

    $(".marketwatch-selector").on("click", function() {
      setTimeout(function() {
        addNotes();
      }, 1500);
    });
    // $(document).on('click','.icon-trash',function(event){
    //   var key= $(event.target).parents('.vddl-draggable').find('.nice-name').text();
    //   chrome.storage.sync.remove(key,function(){
    //     //$(event.target).parents('.info').find('.popup_content').hide();
    //   })
    // });

    $(document).on("click", ".delete_btn", function(event) {
      var key = $(event.target)
        .parents(".info")
        .find(".nice-name")
        .text();
      chrome.storage.sync.remove(key, function() {
        $(event.target)
          .parents(".info")
          .find(".popup_content")
          .hide();
      });
    });

   
    $(document).on("click", function(event) {
      if ($(event.target).hasClass("ext_tooltip")) {
        if (
          $(event.target)
            .parent()
            .find(".popup_content").length == 0
        ) {
          $(event.target)
            .parent()
            .append(popuphtml);
        } else {
          $(event.target)
            .parent()
            .find(".popup_content")
            .show();
        }
        setMaxDateForDatePicker();
        var key = $(event.target)
          .parents(".symbol")
          .find(".nice-name")
          .text();
        chrome.storage.sync.get(key, function(data) {
          if(data && data.key){
            $(event.target)
            .parent()
            .find(".content_editable")
            .val(data[key].message);
          $(event.target)
            .parent()
            .find("#datePicker")
            .val(data[key].date)
            .blur();
          }
         
        });
      } else if ($(event.target).hasClass("pupup_close")) {
        $(event.target)
          .parent()
          .hide();
      }
    });
  }

}, 2000);
