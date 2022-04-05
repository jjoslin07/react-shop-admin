import { Link } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { Publish } from "@material-ui/icons";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../redux/requestMethods";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import { updateProduct } from "../../redux/apiCalls";

export default function Product() {
	const location = useLocation();
	const productId = location.pathname.split("/")[2];
	const dispatch = useDispatch();
	const { title, img, desc, categories, size, color, price, inStock } =
		useSelector((state) =>
			state.product.products.find(({ _id }) => _id === productId)
		);
	const [data, setData] = useState({
		title,
		img,
		desc,
		categories,
		size,
		color,
		price,
		inStock,
	});
	const handleUpdate = (e) => {
		const { name, value, files } = e.target;
		if (["categories", "sizes", "colors"].includes(name))
			setData((d) => ({ ...d, [name]: value.split(",") }));
		else if (files) {
			const fileName = new Date().getTime() + files[0].name;
			const storage = getStorage(app);
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, files[0]);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log("Upload is " + progress + "% done");
					switch (snapshot.state) {
						case "paused":
							console.log("Upload is paused");
							break;
						case "running":
							console.log("Upload is running");
							break;
						default:
					}
				},
				(error) => {
					console.error("Error in New product file Line 36", error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						setData((d) => ({ ...d, [name]: downloadURL }));
					});
				}
			);
		} else setData((d) => ({ ...d, [name]: value }));
	};
	const handleClick = (e) => {
		e.preventDefault();
		updateProduct(productId, data, dispatch);
	};

	const [productStats, setProductStats] = useState([]);

	const product = useSelector((state) =>
		state.product.products.find((product) => product._id === productId)
	);

	const MONTHS = useMemo(
		() => [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		[]
	);

	useEffect(() => {
		const getStats = async () => {
			try {
				const res = await userRequest.get("orders/income?pid=" + productId);
				const list = res.data.sort((a, b) => {
					return a._id - b._id;
				});
				list.map((item) =>
					setProductStats((prev) => [
						...prev,
						{ name: MONTHS[item._id - 1], Sales: item.total },
					])
				);
			} catch (error) {
				console.log(error);
			}
		};
		getStats();
	}, [MONTHS, productId]);

	return (
		<div className="product">
			<div className="productTitleContainer">
				<h1 className="productTitle">Product</h1>
				<Link to="/newproduct">
					<button className="productAddButton">Create</button>
				</Link>
			</div>
			<div className="productTop">
				<div className="productTopLeft">
					<Chart
						data={productStats}
						dataKey="Sales"
						title="Sales Performance"
					/>
				</div>
				<div className="productTopRight">
					<div className="productInfoTop">
						<img src={product.img} alt="" className="productInfoImg" />
						<span className="productName">{product.title}</span>
					</div>
					<div className="productInfoBottom">
						<div className="productInfoItem">
							<span className="productInfoKey">id:</span>
							<span className="productInfoValue">{product._id}</span>
						</div>
						<div className="productInfoItem">
							<span className="productInfoKey">sales:</span>
							<span className="productInfoValue">5123</span>
						</div>
						{/* <div className="productInfoItem">
							<span className="productInfoKey">active:</span>
							<span className="productInfoValue">yes</span>
						</div> */}
						<div className="productInfoItem">
							<span className="productInfoKey">in stock:</span>
							<span className="productInfoValue">
								{product.inStock ? "yes" : "no"}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="productBottom">
				<form className="productForm">
					<div className="productFormLeft">
						<label>Product Name</label>
						<input
							name="title"
							type="text"
							placeholder={product.title}
							onChange={handleUpdate}
						/>
						<label>Description</label>
						<textarea
							name="desc"
							type="text"
							placeholder={product.desc}
							onChange={handleUpdate}
						/>
						<label>Price</label>
						<input
							name="price"
							type="number"
							placeholder={product.price}
							onChange={handleUpdate}
						/>
						<label>In Stock</label>
						<select onChange={handleUpdate} name="inStock" id="idStock">
							<option value="true">Yes</option>
							<option value="false">No</option>
						</select>
						{/* <label>Active</label>
						<select name="active" id="active">
							<option value="yes">Yes</option>
							<option value="no">No</option>
						</select> */}
					</div>
					<div className="productFormRight">
						<div className="productUpload">
							<img src={product.img} alt="" className="productUploadImg" />
							<label htmlFor="file">
								<Publish />
							</label>
							<input
								type="file"
								id="file"
								style={{ display: "none" }}
								onChange={handleUpdate}
							/>
						</div>
						<button className="productButton" onClick={handleClick}>
							Update
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
