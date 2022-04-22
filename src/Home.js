import axios from 'axios';
import {useState} from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import SyncLoader from "react-spinners/SyncLoader";

export default function Home() {
	const [searchCity, setSearchCity] = useState(null);
	const [city, setCity] = useState(null);
	const [checkIn, setCheckIn] = useState(null);
	const [checkOut, setCheckOut] = useState(null);
	const [guests, setGuests] = useState(null);
	const [hotels, setHotels] = useState(null);
	const [loading, setLoading] =useState(false)
	const [hotelDetails, setHotelDetails] = useState(null)

	const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
	const API_HOST = process.env.REACT_APP_RAPIDAPI_HOST;

	const getCity = async () => {
		try {
			setLoading(true)
			const res = await axios.get('https://hotels4.p.rapidapi.com/locations/v2/search', {
				params: { "query" : searchCity},
				headers: {
					"x-rapidapi-host": API_HOST,
					"x-rapidapi-key": API_KEY
				}
			});

			const {data} = res;
			setCity(data.suggestions[0].entities[0].destinationId);
			setLoading(false)
		} catch (error) {
			console.log(error);
			setLoading(false)
		}
	};

	const getHotels = async () => {
		try {
			setLoading(true)
			const res = await axios.get('https://hotels4.p.rapidapi.com/properties/list', {
				params: {
					"destinationId" : city,
					"pageNumber" : '1',
					"pageSize" : '25',
					"checkIn" : checkIn,
					"checkOut" : checkOut,
					"adults1": guests,
					"sortOrder" : 'PRICE',
					"locale" : 'en_US',
					"currency" : 'PHP'
				},
				headers: {
					"x-rapidapi-host": API_HOST,
					"x-rapidapi-key": API_KEY
				}
			});

			setLoading(false)
			const {data} = res;
			setHotels(data.data.body);
		} catch (error) {
			console.log(error);
			setLoading(false)
		}
	};
	
	const getHotelInfo = async (hotelId) => {
		setCity(null)
		setHotels(null)
		try {
			setLoading(true)
			const res = await axios.get('https://hotels4.p.rapidapi.com/properties/get-details', {
				params: {
					"id" : hotelId,
					"checkIn" : checkIn,
					"checkOut" : checkOut,
					"adults1": guests,
					"currency" : 'PHP',
					"locale" : 'en_US'
				},
				headers: {
					"x-rapidapi-host": API_HOST,
					"x-rapidapi-key": API_KEY
				}
			});

			const {data} = res;
			console.log(data.data.body)
			setHotelDetails(data.data.body);
			setLoading(false)
		} catch (error) {
			console.log(error);
			setLoading(false)
		}
	};

	const override = `
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 100%;
	height: 100vh;
	`;

	return (
		<div>
			{loading ?
				<SyncLoader color={"#5C109E"} loading={loading} size={15} css={override} />
			:
			<>
				<div className="flex flex-col md:px-12 px-0 relative bg-background font-raleway items-center min-h-screen bg-indigo-50">
				<h1 className="text-6xl text-zinc-700 font-bold mt-20 text-center px-3">
					Hotel Hanap <span className="text-indigo-800">App</span>
				</h1>
				<h2 className="text-indigo-800 text-2xl mt-6 text-center px-3">
					Looking for a place to stay during your vacation? We got you!
				</h2>
				<div className="sm:mx-auto mt-20 justify-center sm:w-full sm:flex text-center">
					<input
						type="text"
						className="block border rounded-md w-screen px-5 py-3 text-base text-background shadow-md focus:outline-none focus:border-transparent focus:ring-2 focus:ring-active"
						placeholder="Enter your destination city"
						onChange={e => {
							setCity(null);
							setHotelDetails(null)
							setSearchCity(e.target.value);
						}}
					/>
					<div className="mt-4 sm:mt-0 sm:ml-3">
						<button
							className="rounded-md px-5 py-3 bg-indigo-800 font-medium text-white sm:px-10"
							onClick={() => getCity()}
						>
							<SearchIcon className='h-6 w-5' />
						</button>
					</div>
				</div>
				{city && (
					<div className="mt-10 w-full sm:mx-auto lg:mx-0">
						<div className="md:grid md:grid-cols-6 gap-1 flex flex-col">
							<div className="rounded-l-lg col-span-2 flex flex-col py-2 items-center bg-zinc-200">
								<label
									for="check-in"
									className="py-2 text-sm font-semibold uppercase"
								>
									Check-in
								</label>
								<input
									id="startDate"
									type="date"
									className='text-black'
									onChange={e => setCheckIn(e.target.value)}
								/>
							</div>
							<div className="col-span-2 py-2 flex flex-col items-center bg-primary bg-zinc-200">
								<label
									for="check-out"
									className="py-2 text-sm font-semibold uppercase"
								>
									Check-out
								</label>
								<input
									id="check-out"
									type="date"
									className='text-black'
									onChange={e => setCheckOut(e.target.value)}
								/>
							</div>
							<div className="col-span-1 py-2 flex flex-col items-center bg-primary overflow-hidden bg-zinc-200">
								<label
									for="guests"
									className="py-2 text-sm font-semibold uppercase"
								>
									Guests
								</label>
								<input
									id="guests"
									type="number"
									placeholder="Total guests"
									className=" text-center text-black"
									onChange={e => setGuests(e.target.value)}
								/>
							</div>
							<div className="rounded-r-lg col-span-1 bg-indigo-700 text-white hover:opacity-80">
								<button
									type="submit"
									className="w-full h-full md:py-0 py-4 font-bold break-words"
									onClick={() => getHotels()}
								>
									Find Hotels
								</button>
							</div>
						</div>
					</div>
				)}
				{hotels && (
					<div className="mt-16">
						<h3 className="text-secondary text-2xl">
							Hotels in{' '}
							<span className="text-indigo-700">{hotels.header}</span>
						</h3>
						<div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
							{hotels.searchResults.results.map(hotel => (
								<div key={hotel.id} className="pt-8">
									<div className="flow-root bg-zinc-600 rounded-lg px-2 pb-6">
										<div className="-mt-6">
											<div className="flex items-center justify-center">
												<span className="p-3 rounded-md shadow-lg">
													<img
														src={
															hotel.optimizedThumbUrls
																.srpDesktop
														}
														width={300}
														height={300}
														alt={hotel.name}
													/>
												</span>
											</div>
											<div className="text-center justify-center items-center">
												<h3 className="mt-2 text-lg text-center font-medium text-white tracking-tight">
													<button onClick={() => getHotelInfo(hotel.id)} >
														{hotel.name}
													</button>
												</h3>
												<div className="flex flex-col mt-5 items-center">
													<span className="mt-2 mb-4 max-w-xs text-sm text-white block">
														Rating:{' '}
														{hotel.guestReviews
															?.rating && (
															<>
																{
																	hotel
																		.guestReviews
																		?.rating
																}
															</>
														)}
													</span>
													<span className="text-2xl font-bold text-indigo-400">
														{
															hotel.ratePlan?.price
																.current
														}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				{hotelDetails && (
					<div className='w-full bg-indigo-50 mt-10'>
						<div className="text-6xl text-zinc-700 font-bold mt-20 text-center px-3">
							{hotelDetails.propertyDescription.name}
						</div>
						<div className='flex items-center justify-center'>
							<div className="text-lg text-zinc-700 mt-5 p-5 w-9/12 bg-indigo-100 rounded-md">
								<div className="text-lg text-zinc-700 mt-3 px-3 text-left">
									<b className='text-indigo-800'>Address:</b>{' '}{hotelDetails.propertyDescription.address.fullAddress}
								</div>
								<div className="text-lg text-zinc-700 mt-3 px-3 text-left">
									<b className='text-indigo-800'>Price:</b>{' '}{hotelDetails.propertyDescription.featuredPrice.currentPrice.formatted}
								</div>
								<div className="text-lg text-zinc-700 mt-3 px-3 text-left">
									<b className='text-indigo-800'>Star Rating:</b>{' '}{hotelDetails.propertyDescription.starRatingTitle}
								</div>
							</div>
						</div>

						<div className="flex items-center justify-center">

						</div>

						<div className='flex items-center justify-center'>
							<div className="text-lg text-zinc-700 mt-10 p-5 w-9/12 bg-indigo-100 rounded-md">
								<b className='text-indigo-800 text-center'><center>Why choose us?</center></b>
								{hotelDetails.overview.overviewSections[0].content.map((item, index) => (
									<ul className='list-disc flex-auto'>
										<li key={index} className="ml-10">{item}</li>
									</ul>
								))}
							</div>
						</div>
						<div className='flex items-center justify-center mb-10'>
							<div className="text-lg text-zinc-700 mt-10 p-5 w-9/12 bg-indigo-100 rounded-md">
								<b className='text-indigo-800 text-center'><center>Rooms</center></b>
								{' '}{hotelDetails.propertyDescription.roomTypeNames.map((item, index) => (
									<ul className='list-disc flex-auto'>
										<li key={index} className="ml-10">{item}</li>
									</ul>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
			</>}
		</div>

	);
}