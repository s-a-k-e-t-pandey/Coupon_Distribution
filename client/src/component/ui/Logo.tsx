import { motion } from 'framer-motion'
import { Meteors } from './Meteor'

export const Logo = () => {
    return (
        <motion.div className="w-full max-w-md mx-auto rounded-full"
        whileHover={{
            boxShadow: "0px 20px 50px rgba(74, 237, 212, 0.7)",
            y: -20,
        }}
        >
            <Meteors number={20}></Meteors>
            <div className="relative">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
                
                <div className="relative shadow-xl bg-white border border-gray-200 px-6 py-8 rounded-2xl">
                    <div className="flex flex-col items-start space-y-2">
                        
                        <div className="flex flex-col">
                            <span className="text-2xl font-medium text-gray-600">the</span>
                            <span className="text-4xl font-bold text-gray-900">Coup Studio</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}