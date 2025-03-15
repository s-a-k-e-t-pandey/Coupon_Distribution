
import { StarBackground } from './StarBackground';
import { Sidebar } from './Sidebar';
import { DataTable } from './DataTable';

const couponData = [
  { id: 1, user: "John Doe", coupon: "STAR50", claimed: "2024-02-28", status: "Active" },
  { id: 2, user: "Jane Smith", coupon: "GALAXY25", claimed: "2024-02-27", status: "Used" },
  { id: 3, user: "Mike Johnson", coupon: "COSMOS75", claimed: "2024-02-26", status: "Expired" },
];

const constellationData = [
  { name: "Ursa Major", visibility: "95%", lastSeen: "2024-02-28", status: "Visible" },
  { name: "Orion", visibility: "87%", lastSeen: "2024-02-27", status: "Visible" },
  { name: "Cassiopeia", visibility: "72%", lastSeen: "2024-02-26", status: "Hidden" },
];

function AdminDash() {
  return (
    <div className="flex min-w-screen min-h-screen bg-gray-950">
      <StarBackground />
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div 
          className="h-48 mb-8 rounded-xl bg-cover bg-center relative overflow-hidden"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80")'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent">
            <div className="p-8">
              <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, Admin_Name</h1>
              <p className="text-purple-200">Monitor and track the coupon management</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DataTable
            title="Claimed Coupons"
            columns={[
              { key: 'user', label: 'User' },
              { key: 'coupon', label: 'Coupon Code' },
              { key: 'claimed', label: 'Claimed Date' },
              { key: 'status', label: 'Status' },
            ]}
            data={couponData}
          />

          <DataTable
            title="Unclaimed Coupon Category"
            columns={[
              { key: 'Category', label: 'Name' },
              { key: 'Count', label: 'Visibility' },
              { key: 'claimed', label: 'Last Seen' },
              { key: 'status', label: 'Status' },
            ]}
            data={constellationData}
          />
        </div>
      </main>
    </div>
  );
}

export default AdminDash;