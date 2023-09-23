import ReclaimSDK from '@reclaimprotocol/reclaim-client-sdk'
import './App.css'
import React, { useEffect, useState } from 'react'
import QRCode from "react-qr-code";


function App() {
  const [sessionId, setSessionId] = useState('')
	const [sessionLink, setSessionLink] = useState('')
	const [sessionState, setSessionState] = useState('IDLE')
	const [proofs, setProofs] = useState()

	const reclaimSDK = new ReclaimSDK('6d6c04eb-237b-4599-8797-94d48b0ac612') // This is a demo API key. Replace with your own API key

  async function generateSession() {
		const userId = '<USER_ID>' // Replace with the user's ID
		setSessionState('GENERATING_VERIFICATION_LINK')
		const session = await reclaimSDK.generateSession({
			userId,
			onProofSubmissionSuccess: () => {
				setSessionState('COMPLETED')
			},
			onError: (error) => {
				setSessionState('FAILED')
				console.log(error)
			}
		})
		setSessionId(session?.sessionId)
		setSessionLink(session?.link)
		setSessionState('GENERATED_VERIFICATION_LINK')
		console.log(session)
	}

  const getSubmittedProofs = async (sessionId) => {
		const proofs = await reclaimSDK.getProofs(sessionId)
		console.log(proofs)
		if (proofs?.proofs) {
			setProofs(proofs?.proofs)
		}
	}

  const render = () => {
		switch (sessionState) {
			case 'IDLE':
				return (
					<button onClick={generateSession} className="h-12 bg-blue-700 hover:bg-blue-800 rounded-md font-bold text-white w-1/3">
						Generate verification link
					</button>
				)
			case 'GENERATING_VERIFICATION_LINK':
				return (
					<button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
						<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
						</svg>
						Generating verification link...
					</button>
				)
			case 'GENERATED_VERIFICATION_LINK':
				return (
					<div className='flex flex-col items-center'>
						<div className='bg-white max-w-fit mt-1'>
							<QRCode className='p-2' value={sessionLink} />
						</div>
						Scan the QR above or
						<a href={sessionLink} className='text-blue-700 underline'>Click on this URL </a>
					</div>
				)
			case 'COMPLETED':
				// Display the proofs received
				return (
					<div className='flex flex-col items-center'>
						<p className='text-center'>Proofs received!</p>
						{/* display proofs */}
						{proofs?.map((proof, i) => {
							return (
								<div className='flex flex-col items-center' key={i}>
									<p className='text-center text-indigo-500'>You provided proof of ownership for {proof?.parameters}</p>
                  <p className='text-center text-indigo-500 '>Your proof id: {proof?.identifier}</p>
									<button className=' bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2 text-center mt-2 text-white' onClick={() => setSessionState('IDLE')}>Generate again!</button>
								</div>
							)
						})}
					</div>
				)
			case 'FAILED':
				return (
					<div className='flex flex-col items-center'>
						<p className='text-center'>Something went wrong. Please try again.</p>
						<button onClick={() => setSessionState('IDLE')} className="h-12 bg-blue-500 rounded-md font-bold text-white w-1/3">
							Try again
						</button>
					</div>
				)
			default:
				return (
					<div className='flex flex-col items-center'>
						<p className='text-center'>Something went wrong. Please try again.</p>
						<button onClick={() => setSessionState('IDLE')} className="h-12 bg-blue-500 rounded-md font-bold text-white w-1/3">
							Try again
						</button>
					</div>
				)
		}
	}

  useEffect(() => {
		if (sessionState === 'COMPLETED') {
			console.log('session completed')
			getSubmittedProofs(sessionId)
		}
	}, [sessionState])


  return (
    <div className="flex flex-col gap-4 p-6 items-center">
      <h1 className='text-2xl font-extrabold'>Reclaim React Starter App</h1>
      <p>
        This is a starter app for React projects that want to use {' '}
         <a href="https://www.npmjs.com/package/@reclaimprotocol/reclaim-client-sdk" className='text-blue-700 underline font-bold'>Reclaim's client SDK.</a>
      </p>
      <p>
        Use this project as a starting point for your own React app. It includes a simple example of how to use the SDK to generate a session link and receive proofs.
      </p>
      {render()}
    </div>
  );
}

export default App;
