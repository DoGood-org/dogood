// Контроллеры для дополнительных функций

// Кошелёк пользователя
exports.getWallet = async (req, res) => {
  try {
    res.json({
      balance: 120, // пример баланса
      transactions: [
        { id: 1, amount: 20, description: "Донат в проект А", date: "2025-03-25" },
        { id: 2, amount: 100, description: "Пополнение кошелька", date: "2025-03-22" }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Лидерборд геймификации
exports.getLeaderboard = async (req, res) => {
  try {
    res.json({
      leaderboard: [
        { user: "Анна", goodDeeds: 50, hours: 120 },
        { user: "Иван", goodDeeds: 45, hours: 110 },
        { user: "Александр", goodDeeds: 42, hours: 90 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Локации на карте добрых дел
exports.getLocations = async (req, res) => {
  try {
    res.json({
      locations: [
        { id: 1, title: "Помощь приюту", lat: 50.1109, lng: 8.6821 },
        { id: 2, title: "Сбор продуктов", lat: 50.1200, lng: 8.6500 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CSR-программы (корпоративная социальная ответственность)
exports.getCSRPrograms = async (req, res) => {
  try {
    res.json({
      csrPrograms: [
        { id: 1, company: "Компания А", program: "Озеленение города", participants: 120 },
        { id: 2, company: "Компания Б", program: "Поддержка пожилых", participants: 75 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
