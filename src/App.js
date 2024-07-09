import React, { useState } from "react";

const initialFriends = [
	{
		id: 118836,
		name: "Clarck",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Jack",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Anthony",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

function Btn({ children, onClick }) {
	return (
		<button
			className="button"
			onClick={onClick}>
			{children}
		</button>
	);
}

export default function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleShowAddFriend() {
		setShowAddFriend((show) => !show);
	}

	function handleAddFriend(friend) {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	}

	function handleSelectFriend(friend) {
		if (selectedFriend) {
			setSelectedFriend((selected) =>
				selected.id === friend.id ? null : friend,
			);
		} else {
			setSelectedFriend(friend);
		}
		setShowAddFriend(false);
	}

	function handleSplitBill(value) {
		setFriends((friends) =>
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value }
					: friend,
			),
		);
		setSelectedFriend(null);
	}

	return (
		<div className="app">
			<div className="sidebar">
				<FriendList
					selectedFriend={selectedFriend}
					onSelectFriend={handleSelectFriend}
					friends={friends}
				/>
				{showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
				<Btn onClick={handleShowAddFriend}>
					{showAddFriend ? "Close" : "Add Friend"}
				</Btn>
			</div>
			{selectedFriend && (
				<FormSplitBill
					onSplitBill={handleSplitBill}
					selectedFriend={selectedFriend}
				/>
			)}
		</div>
	);
}

function FriendList({ friends, onSelectFriend, selectedFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					onSelectFriend={onSelectFriend}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
	let isSelected;

	if (selectedFriend) {
		isSelected = selectedFriend.id === friend.id;
	}

	return (
		<li className={isSelected ? "selected" : ""}>
			<img
				src={friend.image}
				alt={friend.name}
			/>
			<h3>{friend.name}</h3>
			{friend.balance < 0 && (
				<p className="red">
					You owe {friend.name} {Math.abs(friend.balance)} $
				</p>
			)}
			{friend.balance > 0 && (
				<p className="green">
					{friend.name} owe you {Math.abs(friend.balance)} $
				</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}
			<Btn onClick={() => onSelectFriend(friend)}>
				{!isSelected ? "Select" : "Close"}
			</Btn>
		</li>
	);
}

function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState("");
	const [image, setImage] = useState("https://i.pravatar.cc/48");

	function handleSubmit(e) {
		e.preventDefault();

		if (!name || !image) return;

		const id = crypto.randomUUID();
		const newFriend = {
			id,
			name,
			image: `${image}?=${id}`,
			balance: 0,
		};
		onAddFriend(newFriend);
		setName("");
		setImage("https://i.pravatar.cc/48");
	}

	return (
		<form
			className="form-add-friend"
			onSubmit={handleSubmit}>
			<label>Friend name</label>
			<input
				type="text"
				onChange={(e) => setName(e.target.value)}
				value={name}
			/>

			<label>Image URL</label>
			<input
				type="text"
				onChange={(e) => setImage(e.target.value)}
				value={image}
			/>
			<Btn>Add</Btn>
		</form>
	);
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
	const [bill, setBill] = useState("");
	const [paidByUser, setPaidByUser] = useState("");
	const paidByFriend = bill ? Number(bill) - Number(paidByUser) : "";
	const [whoIsPaying, setWhoIsPaying] = useState("user");

	function handleSubmit(e) {
		e.preventDefault();
		onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
	}

	return (
		<form
			className="form-split-bill"
			onSubmit={handleSubmit}>
			<h2>Split the bill with {selectedFriend.name}</h2>

			<label>Bill value</label>
			<input
				type="number"
				value={bill}
				onChange={(e) => setBill(e.target.value)}
			/>

			<label>Your expence</label>
			<input
				type="number"
				value={paidByUser}
				onChange={(e) =>
					setPaidByUser(
						Number(e.target.value) <= Number(bill)
							? e.target.value
							: paidByUser,
					)
				}
			/>

			<label>{selectedFriend.name}'s expence</label>
			<input
				type="text"
				disabled
				value={paidByFriend}
			/>

			<label>Who's paying the bill</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}>
				<option value={"user"}>You</option>
				<option value={"friend"}>{selectedFriend.name}</option>
			</select>
			<Btn>Split bill</Btn>
		</form>
	);
}
