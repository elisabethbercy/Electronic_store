App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // techs
    $.getJSON('../tech.json', function(data) {
      var Row = $('#Row');
      var Template = $('#Template');

      for (i = 0; i < data.length; i ++) {
        Template.find('.panel-title').text(data[i].name);
        Template.find('img').attr('src', data[i].picture);
        Template.find('.specs').text(data[i].specs);
        Template.find('.condition').text(data[i].condition);
        Template.find('.price').text(data[i].price);
        Template.find('.btn-buy').attr('data-id', data[i].id);

        Row.append(Template.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
  
  // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Techmat.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var TechmatArtifact = data;
      App.contracts.Techmat = TruffleContract(TechmatArtifact);
    
      // Set the provider for our contract
      App.contracts.Techmat.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the tech
      return App.markPurchased();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handlePurchased);
  },

  markPurchased: function() {
    var techmatInstance;

App.contracts.Techmat.deployed().then(function(instance) {
  techmatInstance = instance;

  return techmatInstance.getBuyers.call();
}).then(function(buyers) {
  for (i = 0; i < buyers.length; i++) {
    if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-tech').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});

  },

  handlePurchased: function(event) {
    event.preventDefault();

    var techId = parseInt($(event.target).data('id'));

    var techmatInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Techmat.deployed().then(function(instance) {
        techmatInstance = instance;
    
        // Execute buy as a transaction by sending account
        return techmatInstance.buy(techId, {from: account});
      }).then(function(result) {
        return App.markPurchased();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
