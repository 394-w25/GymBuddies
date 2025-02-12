import { getUser } from '@/lib/db';
import { User } from '@/types/user';
import { useEffect, useState } from 'react'
import UserDisplayFollowCard from '../common/UserDisplayFollowCard';

type Props = {
    userIds : string[];
    following? : boolean;
}

function UserList({userIds, following=false}: Props) {

    const [usersData, setUsersData] = useState<User[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const usersPromises =[];
            for (let id of userIds) {
                const data = getUser(id);
                usersPromises.push(data);
            }

            const data = await Promise.all(usersPromises);
            setUsersData(data as User[]);
        }

        fetchUsers();

    }, [userIds])

  return (
    <div className="list-of-known-users-matching-search flex flex-col py-1 border border-gray-20 rounded-md justify-start items-center max-h-[30vh] overflow-x-hidden overflow-y-scroll">
        {usersData.map((user, key) => (
            <UserDisplayFollowCard displayedUser={user} followingList={following} key={key} />
        ))}
    </div>
  )
}

export default UserList