
export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="mb-4">Welcome to your dashboard. Here you can track your activity, contributions, and impact.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-teal-600 p-4 rounded-xl text-center shadow">
                    <p className="text-2xl font-bold">28</p>
                    <p className="text-sm">Good Deeds</p>
                </div>
                <div className="bg-yellow-500 p-4 rounded-xl text-center shadow">
                    <p className="text-2xl font-bold">15h</p>
                    <p className="text-sm">Help Hours</p>
                </div>
                <div className="bg-purple-500 p-4 rounded-xl text-center shadow">
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm">Badges Earned</p>
                </div>
            </div>
        </div>
    );
}
