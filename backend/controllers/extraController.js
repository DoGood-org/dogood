
exports.getWallet = async (req, res) => {
  try {
    res.json({
      balance: 120, //
      transactions: [
        { id: 1, amount: 20, description: "Donation to Project A", date: "2025-03-25" },
        { id: 2, amount: 100, description: "Wallet Top-up", date: "2025-03-22" }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
exports.getLeaderboard = async (req, res) => {
  try {
    res.json({
      leaderboard: [
        { user: "Anna", goodDeeds: 50, hours: 120 },
        { user: "Ivan", goodDeeds: 45, hours: 110 },
        { user: "Alexander", goodDeeds: 42, hours: 90 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
exports.getLocations = async (req, res) => {
  try {
    res.json({
      locations: [
        { id: 1, title: "Animal Shelter Help", lat: 50.1109, lng: 8.6821 },
        { id: 2, title: "Food Collection", lat: 50.1200, lng: 8.6500 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CSR
exports.getCSRPrograms = async (req, res) => {
  try {
    res.json({
      csrPrograms: [
        { id: 1, company: "Company A", program: "Urban Greening", participants: 120 },
        { id: 2, company: "Company B", program: "Elderly Support", participants: 75 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
