/* TODO

public class PList : WebSite.Com.BoxPhoto.Page {
    protected System.Web.UI.WebControls.RadioButtonList SortList;
    protected WebSite.PageList.DefPageList PageList;

    public BoxPhotoContext ctx;

    public string rvPhotoListScript;

    private void Page_Load(object sender, System.EventArgs e) {
      SetBoxPhotoContext();
      ctx = BoxPhotoContext;
    }

    private void Page_PreRender(object sender, System.EventArgs e) {
      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        cmd = new SqlCommand("BoxPhotoSelectList", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@Func", SqlDbType.Char, 1).Value = ctx.Function;
        cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = ctx.PageNumber;
        cmd.Parameters.Add("@PageCount", SqlDbType.Int).Direction = ParameterDirection.Output;
        //cmd.Parameters.Add("@Search", SqlDbType.NVarChar, 64).Value = "";
        switch (ctx.Function) {
          case BoxPhotoContext.FuncPhoto:
            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = OwnerID;
            cmd.Parameters.Add("@SortKey", SqlDbType.Char, 1).Value = ctx.SortKey;
            cmd.Parameters.Add("@SortDir", SqlDbType.Char, 1).Value = ctx.SortDir;

            reader = cmd.ExecuteReader();
            SortList.Visible = reader.HasRows;
            rvPhotoListScript = BoxPhotoContext.GetPhotoListScript(ctx.UrlMaker.GetUrl("PView.aspx"),OwnerID,reader);
            reader.Close();
            if (SortList.Visible) {
              PageList.PageUrl = ctx.UrlMaker.Clone().AddParam("pg",null).GetUrl("PList.aspx");
              PageList.PageCount = (int)cmd.Parameters["@PageCount"].Value;
              PageList.PageNumber = ctx.PageNumber;
            }
            SortList.Items.FindByValue(ctx.Sort).Selected = true;
            break;

          case BoxPhotoContext.FuncPhotoFav:
          case BoxPhotoContext.FuncPhotoLast:

            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = OwnerID; // PhotoLast 모드에서는 무용

            ScriptBuilder script = new ScriptBuilder(3072);
            script.ScriptBegin();
            script.FuncBegin("phtLBegin").Param(ctx.UrlMaker.GetUrl("PView.aspx")).FuncEnd();
            reader = cmd.ExecuteReader();
            while (reader.Read()) {
              script.FuncBegin("bpFPL");
              script.Param((int)reader["PhotoID"]);
              script.ParamEscaped((string)reader["Title"]);
              script.Param((int)reader["UserID"]);
              script.Param(UserManager.GetUser((int)reader["UserID"]).Name);
              script.Param((int)reader["Hit"]);
              script.Param((int)reader["RepCnt"]);
              script.Param(((DateTime)reader["Date"]).ToString("yyyy-MM-dd HH:mm"));
              script.Param(reader["Music"].ToString()[0] == 'Y');
              script.FuncEnd();
            }
            reader.Close();
            script.Func("phtLEnd");
            script.ScriptEnd();
            rvPhotoListScript = script.ToString();

            PageList.PageUrl = ctx.UrlMaker.Clone().AddParam("pg",null).GetUrl("PList.aspx");
            PageList.PageCount = (int)cmd.Parameters["@PageCount"].Value;
            PageList.PageNumber = ctx.PageNumber;

            SortList.Visible = false;
            break;
        }
      }
    }

    #region Web Form Designer generated code
    override protected void OnInit(EventArgs e) {
      //
      // CODEGEN: This call is required by the ASP.NET Web Form Designer.
      //
      InitializeComponent();
      base.OnInit(e);
    }
    
    /// <summary>
    /// Required method for Designer support - do not modify
    /// the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent() {  
      this.Load += new System.EventHandler(this.Page_Load);
      this.PreRender += new System.EventHandler(this.Page_PreRender);
      this.SortList.SelectedIndexChanged += new System.EventHandler(this.SortList_SelectedIndexChanged);
    }
    #endregion

    private void SortList_SelectedIndexChanged(object sender, System.EventArgs e) {
      ctx.UrlMaker.AddParam("s", SortList.SelectedValue).AddParam("pg", null).Redirect("PList.aspx");
    }

  }

  
procedure BoxPhotoSelectList
    @Func     char(1)
    ,@UserID    int = 0
    ,@SortKey   char(1) = ''
    ,@SortDir   char(1) = ''
    ,@PageSize    int = 30
    ,@PageNumber  int
    ,@PageCount   int output
    --,@Search    nvarchar(64) = ''
    as

    declare @HeadSize int
    declare @TailSize int
    declare @ReturnSize int
    declare @RowCount int

    if (@Func = 'P') -- 개인 전체 사진
      select @RowCount = count(*) 
      from BoxPhotos where UserID = @UserID
    else if (@Func = 'F') -- 즐겨찾는 사진가들의 최근 사진
      select @RowCount = count(*) 
      from BoxPhotos BP join UserFavs UF on BP.UserID = UF.TargetUserID
      where BP.CDate > getdate() - 10 and UF.OwnerUserID = @UserID
    else -- 전체 최근 사진
      select @RowCount = count(*) 
      from BoxPhotos 
      --where CDate > getdate() - 3
    
    select @PageCount =  (@RowCount - 1) / @PageSize + 1
    select @HeadSize = @PageSize * (@PageNumber + 1)
    select @TailSize = @RowCount - @PageSize * @PageNumber
    select @ReturnSize = case when @PageSize < @TailSize then @PageSize else @TailSize end

    if (@TailSize < 0) return;

    if (@Func = 'P') -- 개인 전체 사진
      begin
        if (@SortKey = 'C') 
        begin
          select P.PhotoID, P.Title, P.CDate as Date, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID) as repCnt
          from
            (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from BoxPhotos where UserID = @UserID order by CDate desc) I order by CDate) I join BoxPhotos P on I.PhotoID = P.PhotoID
          order by P.CDate desc
        end
        else
        begin
          select P.PhotoID, P.Title, P.UDate as Date, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID) as repCnt
          from
            (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, UDate from BoxPhotos where UserID = @UserID order by UDate desc) I order by UDate) I join BoxPhotos P on I.PhotoID = P.PhotoID
          order by P.UDate desc
        end

      end
    else if (@Func = 'F') -- 즐겨찾는 사진가들의 최근 사진
      begin
        select P.PhotoID, P.Title, P.CDate as Date, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID) as repCnt, UserID
        from 
          (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from BoxPhotos BP join UserFavs UF on BP.UserID = UF.TargetUserID where BP.CDate > getdate() - 10 and UF.OwnerUserID = @UserID  order by CDate desc) I order by CDate) I join BoxPhotos P on I.PhotoID = P.PhotoID
        order by P.CDate desc
      end
    else -- 전체 최근 사진
      begin
        select P.PhotoID, P.Title, P.CDate as Date, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID) as repCnt, UserID
        from (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from BoxPhotos BP order by CDate desc) I order by CDate) I join BoxPhotos P on I.PhotoID = P.PhotoID
        order by P.CDate desc
      end
    
    return
  go

*/
