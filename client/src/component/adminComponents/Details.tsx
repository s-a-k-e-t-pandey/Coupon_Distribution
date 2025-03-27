import { DataTable } from '../ui/DataTable';

export const Details = () => {

    const couponData = [
        { id: 1, user: "John Doe", coupon: "STAR50", claimed: "2024-02-28", status: "Active" },
        { id: 2, user: "Jane Smith", coupon: "GALAXY25", claimed: "2024-02-27", status: "Used" },
        { id: 3, user: "Mike Johnson", coupon: "COSMOS75", claimed: "2024-02-26", status: "Expired" },
      ];

    return (
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
                      title="Claimed Coupons"
                      columns={[
                        { key: 'user', label: 'User' },
                        { key: 'coupon', label: 'Coupon Code' },
                        { key: 'claimed', label: 'Claimed Date' },
                        { key: 'status', label: 'Status' },
                      ]}
                      data={couponData}
                    />
        </div>
    )
}