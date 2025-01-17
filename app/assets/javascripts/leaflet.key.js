L.OSM.key = function (options) {
  var control = L.control(options);

  control.onAdd = function (map) {
    var $container = $("<div>")
      .attr("class", "control-key");

    var button = $("<a>")
      .attr("class", "control-button")
      .attr("href", "#")
      .html("<span class=\"icon key\"></span>")
      .on("click", toggle)
      .appendTo($container);

    var $ui = $("<div>")
      .attr("class", "key-ui");

    $("<div>")
      .attr("class", "sidebar_heading")
      .appendTo($ui)
      .append(
        $("<button type='button' class='btn-close float-end mt-1'>")
          .attr("aria-label", I18n.t("javascripts.close"))
          .bind("click", toggle))
      .append(
        $("<h4>")
          .text(I18n.t("javascripts.key.title")));

    var $section = $("<div>")
      .attr("class", "section")
      .appendTo($ui);

    options.sidebar.addPane($ui);

    $ui
      .on("show", shown)
      .on("hide", hidden);

    map.on("baselayerchange", updateButton);

    updateButton();

    function shown() {
      map.on("zoomend baselayerchange", update);
      $section.load("/key", update);
    }

    function hidden() {
      map.off("zoomend baselayerchange", update);
    }

    function toggle(e) {
      e.stopPropagation();
      e.preventDefault();
      if (!button.hasClass("disabled")) {
        options.sidebar.togglePane($ui, button);
      }
      $(".leaflet-control .control-button").tooltip("hide");
    }

    function updateButton() {
      var disabled = ["mapnik", "cyclemap"].indexOf(map.getMapBaseLayerId()) === -1;
      button
        .toggleClass("disabled", disabled)
        .attr("data-bs-original-title",
              I18n.t(disabled ?
                "javascripts.key.tooltip_disabled" :
                "javascripts.key.tooltip"));
    }

    function update() {
      var layer = map.getMapBaseLayerId(),
          zoom = map.getZoom();

      $(".mapkey-table-entry").each(function () {
        var data = $(this).data();
        if (layer === data.layer && zoom >= data.zoomMin && zoom <= data.zoomMax) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    }

    return $container[0];
  };

  return control;
};
