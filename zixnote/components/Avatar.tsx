const Avatar = ({ avatar_url }: { avatar_url: string }) => {
  return (
    <div className="avatar">
      <div className="w-8 rounded-full">
        <img src={avatar_url} />
      </div>
    </div>
  );
};

export default Avatar