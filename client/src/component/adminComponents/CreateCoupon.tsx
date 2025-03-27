import { useState, FormEvent } from "react"
import { Input } from "../ui/Input"
import { motion } from "framer-motion"
import axios from "axios"
import { Loader2 } from "lucide-react"

interface CouponInputs {
    code: string;
    totalQty: number;
    expiryDate: string;
}

export const CreateCoupon = () => {
    const [postInputs, setPostInputs] = useState<CouponInputs>({
        code: '',
        totalQty: 0,
        expiryDate: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            if (!postInputs.code || !postInputs.totalQty || !postInputs.expiryDate) {
                throw new Error("Please fill all fields")
            }

            const formattedInputs = {
                ...postInputs,
                expiryDate: new Date(postInputs.expiryDate).toISOString(),
            }

            const token = localStorage.getItem("token")
            const response = await axios.post(
                "http://localhost:3000/create-coupon", 
                formattedInputs, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            )

            setSuccess(true)
            setPostInputs({ code: '', totalQty: 0, expiryDate: '' })
            setTimeout(() => setSuccess(false), 3000)

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create coupon")
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.form onSubmit={handleSubmit} className="max-w-md mx-auto"
            whileHover={{
                boxShadow: "0px 20px 50px rgba(153, 112, 234, 0.7)",
                y: -5,
            }}
        >
            <motion.div
                className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20"
            >
                <motion.h2 
                    className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                    Create Coupon
                </motion.h2>

                <div className="space-y-4 text-white">
                    <Input 
                        label="Coupon Code" 
                        placeholder="SUMMER2024" 
                        value={postInputs.code}
                        onChange={(e) => setPostInputs({
                            ...postInputs,
                            code: e.target.value
                        })} 
                        type="text"
                    />
                    <Input 
                        label="Quantity" 
                        placeholder="100" 
                        value={postInputs.totalQty || ''}
                        onChange={(e) => setPostInputs({
                            ...postInputs,
                            totalQty: parseInt(e.target.value) || 0
                        })} 
                        type="number"
                    />
                    <Input 
                        label="Expiry Date" 
                        placeholder="Select date and time" 
                        value={postInputs.expiryDate}
                        onChange={(e) => setPostInputs({
                            ...postInputs,
                            expiryDate: e.target.value
                        })} 
                        type="datetime-local"
                    />
                </div>

                {error && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-4 text-center"
                    >
                        {error}
                    </motion.p>
                )}

                {success && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-400 text-sm mt-4 text-center"
                    >
                        Coupon created successfully!
                    </motion.p>
                )}

                <div className="flex justify-center mt-6">
                    <motion.button 
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 
                                 text-purple-400 transition-all duration-200 flex items-center gap-2 
                                 border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Coupon'
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </motion.form>
    )
}