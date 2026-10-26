export default function XIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 21 24" 
            fill="none"
        >
            <path 
                d="M16.5414 1.95459H19.7004L12.7989 9.84364L20.9189 20.573H14.5614L9.58286 14.0638L3.88582 20.573H0.724817L8.08182 12.1633L0.287109 1.95459H6.80582L11.3069 7.90484L16.5414 1.95459ZM15.4328 18.6797H17.1834L5.85077 3.70014H3.97232L15.4328 18.6797Z" 
                fill={color}
            />
        </svg>
    );
}
