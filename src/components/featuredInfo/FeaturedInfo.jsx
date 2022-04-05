import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { userRequest } from "../../redux/requestMethods";

export default function FeaturedInfo() {
	const [income, setIncome] = useState([]);
	const [percentage, setPercentage] = useState(0);

	useEffect(() => {
		const getIncome = async () => {
			try {
				const res = await userRequest.get("orders/income");
				setIncome(res.data);
				setPercentage((res.data[1].total * 100) / res.data[0].total - 100);
				console.log(res.data);
			} catch (error) {}
		};
		getIncome();
	}, []);
	return (
		<div className="featured">
			<div className="featuredItem">
				<span className="featuredTitle">Sales</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">${income[1]?.total}</span>
					<span className="featuredMoneyRate">
						{percentage?.toFixed(2)}%
						{percentage < 0 ? (
							<ArrowDownward className="featuredIcon negative" />
						) : (
							<ArrowUpward className="featuredIcon" />
						)}
					</span>
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>
			<div className="featuredItem">
				<span className="featuredTitle">Cost</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">$ --</span>
					<span className="featuredMoneyRate"></span>
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>
			<div className="featuredItem">
				<span className="featuredTitle">Net Income</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">$ --</span>
					<span className="featuredMoneyRate"></span>
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>
		</div>
	);
}
