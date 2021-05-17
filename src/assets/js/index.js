$(document).ready(function () {
  
  /* Jquery Multiple File Uploader Function */
  var uploadElement = $("#thefiles, #thefiles2");
  if (uploadElement.length) {
    uploadElement.FancyFileUpload({
      params: {
        // editable file name?
        edit: false,
        // max file size
        maxfilesize: 3,
        // max file size
        preview: null,
      },
    });
  }
  /* Jquery Multiple File Uploader Function */

  /* Jquery Text Editor Function */

  var editorElem = $(
    "#txtEditor, #txtEditor2, #txtEditor3, #txtEditorVRD, #txtEditor5"
  );
  if (editorElem.length) {
    $("#txtEditor").Editor();
    $("#txtEditor2").Editor();
    $("#txtEditor3").Editor();
    $("#txtEditor5").Editor();
    $("#txtEditorVRD").Editor();
    //$("#txtEditor2").Editor("setText", "")
    $("#txtEditor5").Editor(
      "setText",
      "Hi Team,<br><br>Can you please update the presentation / charts with the information / instructions on the page.<br><br>I attached the comps / NTM files that should be used for this. PLease note that the PFG NTM tab is manually adjusted. Can you please for the brokers named in that tab send me the latest research reports too?<br><br>I also attached the Master Comps file that has the outputs for page. Please include the output in the PFG comps file and update it for the companies outlined in the tab. Please keep them in that order.<br><br>Best,<br>Amanda Brufman"
    );
  }
  /* Jquery Text Editor Function */

  function respTable() {
    if ($(window).width() < 1025) {
      $("#viewRequestTable").addClass("table-responsive");
    } else {
      $("#viewRequestTable").removeClass("table-responsive");
    }
  }
  /* Jquery DataTable Function */

  if ($("#viewRequestTable").length) {
    $("#viewRequestTable").DataTable({
      responsive: false,
      columnDefs: [{ orderable: false, targets: 8 }],
    });
    respTable();
    $(window).resize(function () {
      //respTable();
      //$("#viewRequestTable").removeClass('table-responsive');
    });
  }
  $(".more-nav").each(function (index) {
    $(this).on("click", function () {
      $(this).parent().find(".global_grid_actions_Container__child").toggle();
    });
  });
  /* Jquery DataTable Function */

  $(".more-nav").each(function (index) {
    $(this).on("click", function () {
      $(this).parent().find(".global_grid_actions_Container__child").toggle();
    });
  });

  $(".toggleFilter").on("click", function () {
    $(".filtersBox").toggle();
  });
  if (
    $(
      "#example, #example1, #example2, #example3, #example4, #example5, #example6, #example7, #example8, #example9"
    ).length
  ) {
    $(
      "#example, #example1, #example2, #example3, #example4, #example5, #example6, #example7, #example8, #example9"
    ).DataTable({
      aaSorting: [],
      //"aaSorting" : [[]]
      responsive: true,
      ordering: false,
      columnDefs: [
        {
          responsivePriority: 1,
          targets: 0,
        },
        {
          responsivePriority: 2,
          targets: -1,
        },
      ],
    });
  }
  $(".dataTables_filter input").attr("placeholder", "").css({
    width: "160px",
    display: "inline-block",
  });

  //$('[data-toggle="tooltip"]').tooltip();

  $(".sorting").css("cursor", "default");
  $(".sorting_asc, .sorting_desc").on("click", function (e) {
    e.preventDefault(e);
    e.stopPropagation(e);
  });

  
});
