function EmptyState({ icon: Icon, title, description }) {
	return (
		<div className="empty-state">
			{Icon && (
				<Icon
					size={48}
					className="empty-icon"
				/>
			)}
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}

export default EmptyState;
