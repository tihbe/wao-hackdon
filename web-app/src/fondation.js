var imgMed = 0;
$("#imgMedBtn").on("click", function () {
  if(imgMed === 0){
    $("#imgMed").show();
    imgMed = 1;
  } else {
    $("#imgMed").hide();
    imgMed = 0;
  }
});
