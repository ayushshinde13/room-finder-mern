  useEffect(() => {
    if (!token || user?.role !== "OWNER") return;

    const fetchMyRooms = async () => {
      try {
        // 修改API路径为/api/rooms/my
        const response = await fetch("http://localhost:5001/api/rooms/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 添加对响应状态的检查
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch my rooms:", errorData.message);
          alert(`Failed to fetch your rooms: ${errorData.message}`);
          return;
        }

        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Failed to fetch my rooms", error);
        alert("Failed to fetch your rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRooms();
  }, [token, user]);