String.prototype.format = function() {
  var s = this,
      i = arguments.length;

  while (i--) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
  }
  return s;
};

!function($) {
  $.timeoutDialog = function(options) {

    var settings = {
      countdown: 0,
      title : 'You should save the document!',
      message : 'You didn\'t saved your work for {0}',
      dialog_width: 350
    }

    $.extend(settings, options);

    var TimeoutDialog = {
      init: function () {
        this.setupDialogTimer();
      },

      setupDialogTimer: function() {
        var self = this;
        window.setTimeout(function() { self.setupDialog(); }, 1000);
      },

      setupDialog: function() {
        var self = this;
        self.destroyDialog();

        $('<div id="timeout-dialog">' +
            '<span class="eea-icon eea-icon-clock-o eea-icon-3x eea-icon-left"></span>' +
            '<p id="timeout-message">' + settings.message.format('<span id="timeout-countdown">' + settings.countdown + '</span>') +
            ' <span id="timeout-measurement"></span>.</p>' +
          '</div>')
        .appendTo('body')
        .dialog({
          modal: false,
          width: settings.dialog_width,
          minHeight: 'auto',
          zIndex: 10000,
          closeOnEscape: false,
          draggable: false,
          resizable: false,
          dialogClass: 'timeout-dialog',
          title: settings.title,
          show: {
                  effect: "fade",
                  duration: 1000
                },
          position: { my: "right top", at: "right bottom", of: window },
        });

        self.startCountdown();
      },

      destroyDialog: function() {
        if ($("#timeout-dialog").length) {
          $(this).dialog("close");
          $('#timeout-dialog').remove();
        }
      },

      toHHMMSS: function(seconds) {
        var sec_num = parseInt(seconds, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = hours+':'+minutes+':'+seconds;
        return time;
      },

      startCountdown: function() {
        var self = this,
            counter = settings.countdown,
            timeMeasurement = 'seconds';

        this.countdown = window.setInterval(function() {
          counter += 1;

          if (counter <= 60) {
              timeMeasurement = 'seconds';
          } else if (counter >= 60 && counter <= 3600) {
              timeMeasurement = 'minutes';
          } else {
              timeMeasurement = 'hours';
          }

          $("#timeout-countdown").html(self.toHHMMSS(counter));
          $("#timeout-measurement").html(timeMeasurement);

          if (counter <= 0) {
            window.clearInterval(self.countdown);
          }

        }, 1000);
      }
    };

    TimeoutDialog.init();
  };
}(window.jQuery);