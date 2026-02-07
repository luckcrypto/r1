$(function() {
  getMarketData();
  setInterval(getMarketData, 1000);
});

function getMarketData() {
  getCryptoCompare();
}

function getCryptoCompare() {
  $.when(
    $.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,USDT,XRP,BNB,SOL,trx,XAUT&tsyms=USD")
  ).done(function (data) {
    $("#btcLogo").html('<img src="https://cryptocompare.com' + data.RAW.BTC.USD.IMAGEURL + '">');
    $("#btcSymbol").text((data.RAW.BTC.USD.FROMSYMBOL).toLocaleString());
    $("#btcPrice").text((data.RAW.BTC.USD.PRICE).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    $("#btcChange").text((data.RAW.BTC.USD.CHANGEPCT24HOUR).toFixed(2) + "‎ ‎%");
    $("#btcVol").text((data.RAW.BTC.USD.VOLUME24HOUR).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#btcCap").text((data.RAW.BTC.USD.MKTCAP).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#btcTime").text( (new Date(data.RAW.BTC.USD.LASTUPDATE * 1000) ).toLocaleString());

    $("#ethLogo").html('<img src="https://cryptocompare.com' + data.RAW.ETH.USD.IMAGEURL + '">');
    $("#ethSymbol").text((data.RAW.ETH.USD.FROMSYMBOL).toLocaleString());
    $("#ethPrice").text((data.RAW.ETH.USD.PRICE).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    $("#ethChange").text((data.RAW.ETH.USD.CHANGEPCT24HOUR).toFixed(2) + "‎ ‎%");
    $("#ethVol").text((data.RAW.ETH.USD.VOLUME24HOUR).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#ethCap").text((data.RAW.ETH.USD.MKTCAP).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#ethTime").text( (new Date(data.RAW.ETH.USD.LASTUPDATE * 1000) ).toLocaleString());

    $("#usdtLogo").html('<img src="https://cryptocompare.com' + data.RAW.USDT.USD.IMAGEURL + '">');
    $("#usdtSymbol").text((data.RAW.USDT.USD.FROMSYMBOL).toLocaleString());
    $("#usdtPrice").text((data.RAW.USDT.USD.PRICE).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    $("#usdtChange").text((data.RAW.USDT.USD.CHANGEPCT24HOUR).toFixed(2) + "‎ ‎%");
    $("#usdtVol").text((data.RAW.USDT.USD.VOLUME24HOUR).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#usdtCap").text((data.RAW.USDT.USD.MKTCAP).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#usdtime").text( (new Date(data.RAW.USDT.USD.LASTUPDATE * 1000) ).toLocaleString());

    $("#xrpLogo").html('<img src="https://cryptocompare.com' + data.RAW.XRP.USD.IMAGEURL + '">');    
    $("#xrpSymbol").text((data.RAW.XRP.USD.FROMSYMBOL).toLocaleString());
    $("#xrpPrice").text((data.RAW.XRP.USD.PRICE).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    $("#xrpChange").text((data.RAW.XRP.USD.CHANGEPCT24HOUR).toFixed(2) + "‎ ‎%");
    $("#xrpVol").text((data.RAW.XRP.USD.VOLUME24HOUR).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#xrpCap").text((data.RAW.XRP.USD.MKTCAP).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#xrpTime").text( (new Date(data.RAW.XRP.USD.LASTUPDATE * 1000) ).toLocaleString());

    $("#bnbLogo").html('<img src="https://cryptocompare.com' + data.RAW.BNB.USD.IMAGEURL + '">'); 
    $("#bnbSymbol").text((data.RAW.BNB.USD.FROMSYMBOL).toLocaleString());
    $("#bnbPrice").text((data.RAW.BNB.USD.PRICE).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    $("#bnbChange").text((data.RAW.BNB.USD.CHANGEPCT24HOUR).toFixed(2) + "‎ ‎%");
    $("#bnbVol").text((data.RAW.BNB.USD.VOLUME24HOUR).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#bnbCap").text((data.RAW.BNB.USD.MKTCAP).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#bnbTime").text( (new Date(data.RAW.BNB.USD.LASTUPDATE * 1000) ).toLocaleString());

    $("#solLogo").html('<img src="https://cryptocompare.com' + data.RAW.SOL.USD.IMAGEURL + '">');
    $("#solSymbol").text((data.RAW.SOL.USD.FROMSYMBOL).toLocaleString());
    $("#solPrice").text((data.RAW.SOL.USD.PRICE).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    $("#solChange").text((data.RAW.SOL.USD.CHANGEPCT24HOUR).toFixed(2) + "‎ ‎%");
    $("#solVol").text((data.RAW.SOL.USD.VOLUME24HOUR).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#solCap").text((data.RAW.SOL.USD.MKTCAP).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#solTime").text( (new Date(data.RAW.SOL.USD.LASTUPDATE * 1000) ).toLocaleString());
    
    $("#trxLogo").html('<img src="https://cryptocompare.com' + data.RAW.TRX.USD.IMAGEURL + '">');
    $("#trxSymbol").text((data.RAW.TRX.USD.FROMSYMBOL).toLocaleString());
    $("#trxPrice").text((data.RAW.TRX.USD.PRICE).toFixed(4).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    $("#trxChange").text((data.RAW.TRX.USD.CHANGEPCT24HOUR).toFixed(2) + "‎ ‎%");
    $("#trxVol").text((data.RAW.TRX.USD.VOLUME24HOUR).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#trxCap").text((data.RAW.TRX.USD.MKTCAP).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#trxTime").text( (new Date(data.RAW.TRX.USD.LASTUPDATE * 1000) ).toLocaleString());

    $("#xautLogo").html('<img src="https://cryptocompare.com' + data.RAW.XAUT.USD.IMAGEURL + '">');
    $("#xautSymbol").text((data.RAW.XAUT.USD.FROMSYMBOL).toLocaleString());
    $("#xautPrice").text((data.RAW.XAUT.USD.PRICE).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
    $("#xautChange").text((data.RAW.XAUT.USD.CHANGEPCT24HOUR).toFixed(2) + "‎ ‎%");
    $("#xautVol").text((data.RAW.XAUT.USD.VOLUME24HOUR).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#xautCap").text((data.RAW.XAUT.USD.MKTCAP).toLocaleString("en-US", {style: "currency", currency: "USD"}));
    $("#xautTime").text( (new Date(data.RAW.XAUT.USD.LASTUPDATE * 1000) ).toLocaleString());
  });
}



$("#btcChange, #ethChange, #usdtChange, #xrpChange, #bnbChange, #solChange, #trxChange, #xautChange").bind("DOMSubtreeModified", function(){
  if($(this).is(":contains('-')")) {
    $(this).removeClass("positive").addClass("negative");
  } else {
    $(this).removeClass("negative").addClass("positive");
  }
});