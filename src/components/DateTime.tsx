
type DateTimeProps = {
    params: Date;
}

export const DateTime = ({ params }: DateTimeProps) => {
    return <span>{new Date(params).toLocaleDateString()}</span>;
}
